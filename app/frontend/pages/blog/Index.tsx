import { Head, Link, router } from '@inertiajs/react'
import { Document } from 'flexsearch'
import { List, Network } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import BlogGraphView from '@/components/BlogGraphView'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

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

interface SearchIndexItem {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  url_path: string
  [key: string]: any
}

interface BlogIndexProps {
  posts: Post[]
  categories: string[]
  tags?: string[]
  search_index: SearchIndexItem[]
}

export default function BlogIndex({ posts, categories, tags, search_index }: BlogIndexProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Initialize view mode from URL params
  const getInitialViewMode = (): 'list' | 'graph' => {
    if (typeof window === 'undefined') return 'list'
    const params = new URLSearchParams(window.location.search)
    const view = params.get('view')
    return view === 'graph' ? 'graph' : 'list'
  }

  const [viewMode, setViewMode] = useState<'list' | 'graph'>(getInitialViewMode)

  // Update URL and localStorage when view mode changes
  const handleViewModeChange = (newMode: 'list' | 'graph') => {
    setViewMode(newMode)

    // Save to localStorage for persistence
    localStorage.setItem('blogViewMode', newMode)

    // Update URL using Inertia router
    router.visit('/blog', {
      data: newMode === 'graph' ? { view: 'graph' } : {},
      preserveState: true,
      preserveScroll: true,
      replace: true,
      only: [], // Don't reload any data
    })
  }

  // Initialize search index
  const searchIndex = useMemo(() => {
    const index = new Document({
      document: {
        id: 'id',
        index: ['title', 'excerpt', 'content'],
        store: ['title', 'url_path'],
      },
    })

    search_index.forEach((doc) => {
      index.add(doc)
    })

    return index
  }, [search_index])

  // Filter posts
  const filteredPosts = useMemo(() => {
    let result = posts

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag))
    }

    if (searchQuery) {
      const searchResults = searchIndex.search(searchQuery) as Array<{ result: string[] }>
      const resultIds = new Set(searchResults.flatMap((r) => r.result))
      result = result.filter((p) => resultIds.has(p.slug))
    }

    return result
  }, [posts, selectedCategory, selectedTag, searchQuery, searchIndex])

  // Calculate tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })
    return counts
  }, [posts])

  return (
    <>
      <Head title="Notes" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Notes
            {(selectedCategory || selectedTag) && (
              <span className="text-lg md:text-xl text-muted-foreground ml-2">
                / {selectedCategory || ''} {selectedTag ? `#${selectedTag}` : ''}
              </span>
            )}
          </h1>

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => handleViewModeChange('list')}
              size="sm"
            >
              <List />
              List
            </Button>
            <Button
              variant={viewMode === 'graph' ? 'default' : 'outline'}
              onClick={() => handleViewModeChange('graph')}
              size="sm"
            >
              <Network />
              Graph
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            type="search"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md"
          />
        </div>

        {/* Categories */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => {
              setSelectedCategory(null)
              setSelectedTag(null)
            }}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground">Filter by Tag</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  // max-w-[calc(50%-0.25rem)]: Max width is half the container width minus gap (gap is 0.5rem, so half gap is 0.25rem)
                  className="whitespace-normal h-auto min-h-8 py-2 max-w-[calc(50%-0.25rem)] text-left"
                >
                  <span className="line-clamp-2 wrap-break-word">
                    {tag} ({tagCounts[tag] || 0})
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Content - Graph or List View */}
        {viewMode === 'graph' ? (
          <BlogGraphView posts={filteredPosts.length > 0 ? filteredPosts : posts} />
        ) : (
          <>
            {/* Posts Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredPosts.map((post) => (
                  <Link key={post.slug} href={post.url_path}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      {post.featured_image && (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-40 sm:h-44 md:h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <CardHeader>
                        <div className="text-sm text-muted-foreground mb-2">
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <CardTitle className="hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription>{post.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 flex-wrap">
                          {post.tags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80 transition-colors"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setSelectedTag(tag)
                              }}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No posts found</p>
                {(searchQuery || selectedCategory || selectedTag) && (
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory(null)
                      setSelectedTag(null)
                    }}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
