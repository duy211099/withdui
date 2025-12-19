import { Head, Link } from '@inertiajs/react'
import { Document } from 'flexsearch'
import { useMemo, useState } from 'react'
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

export default function BlogIndex({ posts, categories, search_index }: BlogIndexProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

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

  return (
    <>
      <Head title="Blog" />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        {/* Search */}
        <div className="mb-8">
          <Input
            type="search"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Categories */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
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

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.slug} href={post.url_path}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-t-lg"
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
                        <span
                          key={tag}
                          className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
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
      </div>
    </>
  )
}
