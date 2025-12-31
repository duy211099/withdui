import { useEffect, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'

interface Post {
  title: string
  slug: string
  date: string
  excerpt: string
  category: string
  tags: string[]
  url_path: string
  featured_image?: string
}

interface GraphNode {
  id: string
  name: string
  val: number // size of the node
  color: string
  url: string
}

interface GraphLink {
  source: string
  target: string
  value: number // thickness of the link (connection strength)
}

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
  categoryColors: Record<string, string>
}

interface BlogGraphViewProps {
  posts: Post[]
}

function buildGraphData(posts: Post[]): GraphData {
  // Extract unique categories and generate colors
  const uniqueCategories = Array.from(new Set(posts.map((p) => p.category)))

  // Predefined color palette for variety
  const colorPalette = [
    '#a855f7', // Purple
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#10b981', // Green
    '#f59e0b', // Amber
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#8b5cf6', // Violet
    '#14b8a6', // Teal
    '#f97316', // Orange
  ]

  // Assign colors to categories
  const categoryColors: Record<string, string> = {}
  uniqueCategories.forEach((category, index) => {
    categoryColors[category] = colorPalette[index % colorPalette.length]
  })

  // Create nodes from posts
  const nodes: GraphNode[] = posts.map((post) => ({
    id: post.slug,
    name: post.title,
    val: 1, // Small value - matches visual size for precise hover
    color: categoryColors[post.category] || colorPalette[0],
    url: post.url_path,
  }))

  // Build connections - only link nodes within the same category for clustering
  const links: GraphLink[] = []

  // Group posts by category
  const postsByCategory = posts.reduce(
    (acc, post) => {
      if (!acc[post.category]) {
        acc[post.category] = []
      }
      acc[post.category].push(post)
      return acc
    },
    {} as Record<string, Post[]>
  )

  // Create links within each category to form clusters
  Object.values(postsByCategory).forEach((categoryPosts) => {
    // Connect each post to a few others in the same category
    categoryPosts.forEach((post, index) => {
      // Link to next 2-3 posts in the same category (creates a mesh network)
      const linksPerNode = Math.min(3, categoryPosts.length - 1)
      for (let i = 1; i <= linksPerNode; i++) {
        const targetIndex = (index + i) % categoryPosts.length
        const targetPost = categoryPosts[targetIndex]

        if (targetPost.slug !== post.slug) {
          links.push({
            source: post.slug,
            target: targetPost.slug,
            value: 2, // Uniform link strength within category
          })
        }
      }
    })
  })

  return { nodes, links, categoryColors }
}

export default function BlogGraphView({ posts }: BlogGraphViewProps) {
  const graphRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
    categoryColors: {},
  })
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; title: string } | null>(
    null
  )
  const [dimensions, setDimensions] = useState({ width: 800, height: 700 })

  useEffect(() => {
    const data = buildGraphData(posts)
    setGraphData(data)
  }, [posts])

  useEffect(() => {
    // Set initial dimensions
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: 700,
      })
    }

    // Handle resize
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 700,
        })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Auto-fit graph only on initial load
    if (graphRef.current && graphData.nodes.length > 0) {
      const timer = setTimeout(() => {
        if (graphRef.current && typeof graphRef.current.zoomToFit === 'function') {
          graphRef.current.zoomToFit(400, 50)
        }
      }, 500) // Wait for physics to settle a bit
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData.nodes.length]) // Only when data initially loads

  const handleNodeClick = (node: any) => {
    window.location.href = node.url
  }

  const handleNodeHover = (node: any) => {
    if (node) {
      setSelectedNode(node.id)
      // Get screen coordinates from graph coordinates
      if (graphRef.current) {
        const coords = graphRef.current.graph2ScreenCoords(node.x, node.y)
        setTooltipData({
          x: coords.x,
          y: coords.y,
          title: node.name,
        })
      }
    } else {
      // Clear everything when not hovering
      setSelectedNode(null)
      setTooltipData(null)
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[700px] border-2 border-border rounded-lg shadow-none hover:shadow-[2px_2px_0_var(--shadow-color)] overflow-hidden bg-card relative transition-all"
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeLabel={() => ''}
        nodeColor={(node: any) => node.color}
        nodeVal={(node: any) => node.val}
        backgroundColor="#f8fafc"
        enableNodeDrag={true}
        enableZoomInteraction={true}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.4}
        warmupTicks={100}
        cooldownTime={2000}
        nodeRelSize={8}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const nodeSize = 8 // Fixed size for all nodes
          const borderWidth = 2 / globalScale

          // Subtle shadow
          ctx.beginPath()
          ctx.arc(node.x + 1, node.y + 1, nodeSize, 0, 2 * Math.PI, false)
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
          ctx.fill()

          // Draw main node circle
          ctx.beginPath()
          ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false)
          ctx.fillStyle = node.color
          ctx.fill()

          // Draw border
          ctx.strokeStyle = '#1f2937'
          ctx.lineWidth = borderWidth
          ctx.stroke()

          // Highlight selected node with white border
          if (node.id === selectedNode) {
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = borderWidth * 1.5
            ctx.stroke()
          }
        }}
        linkColor={() => 'rgba(100, 100, 100, 0.3)'}
        linkWidth={(link: any) => Math.max(link.value * 0.8, 1)}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        cooldownTicks={100}
      />

      {/* Floating tooltip - always on top */}
      {tooltipData && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: tooltipData.x,
            top: tooltipData.y + 20,
            transform: 'translateX(-50%)',
            zIndex: 1000,
          }}
        >
          <div className="bg-card border-2 border-border rounded-lg shadow-[2px_2px_0_var(--shadow-color)] px-3 py-2 max-w-[250px]">
            <p className="text-sm font-semibold text-foreground text-center">{tooltipData.title}</p>
          </div>
        </div>
      )}

      {/* Help box */}
      <div className="absolute bottom-4 left-4 right-4 bg-secondary border-2 border-border rounded-lg shadow-[2px_2px_0_var(--shadow-color)] p-3">
        <p className="text-sm font-semibold text-secondary-foreground">
          💡 Hover to see titles • Click to visit posts • Posts grouped by category
        </p>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-card border-2 border-border rounded-lg shadow-[2px_2px_0_var(--shadow-color)] p-3 max-h-[200px] overflow-y-auto">
        <p className="text-xs font-semibold text-foreground mb-2">Categories</p>
        <div className="flex flex-col gap-1.5">
          {Object.entries(graphData.categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm border border-border"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-xs font-medium">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
