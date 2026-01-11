import { Head, Link } from '@inertiajs/react'
import LocalTime from '@/components/LocalTime'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { note_category_path, note_index_path, note_tag_path } from '@/lib/routes'
import type { PostListItem } from '@/types'

interface CategoryProps {
  category?: string
  tag?: string
  posts: PostListItem[]
  allCategories?: string[]
  allTags?: string[]
}

export default function Category({ category, tag, posts, allCategories, allTags }: CategoryProps) {
  const title = category ? `Category: ${category}` : `Tag: ${tag}`
  const filterType = category ? 'category' : 'tag'

  // Preserve the view mode when going back
  const getBackUrl = () => {
    const savedView = typeof window !== 'undefined' ? localStorage.getItem('noteViewMode') : null
    return savedView === 'graph' ? note_index_path({ view: 'graph' }) : note_index_path()
  }

  return (
    <>
      <Head title={title} />

      <div className="container mx-auto px-4 py-8">
        <Link href={getBackUrl()}>
          <Button variant="ghost" className="mb-4">
            ← Back to Notes
          </Button>
        </Link>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-8">
          {posts.length} post{posts.length !== 1 ? 's' : ''}
        </p>

        {/* Filter Options */}
        {filterType === 'category' && allCategories && allCategories.length > 1 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground self-center mr-2">
              Other categories:
            </span>
            {allCategories
              .filter((c) => c !== category)
              .map((cat) => (
                <Link key={cat} href={note_category_path(cat)}>
                  <Button variant="outline" size="sm">
                    {cat}
                  </Button>
                </Link>
              ))}
          </div>
        )}

        {filterType === 'tag' && allTags && allTags.length > 1 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground self-center mr-2">Other tags:</span>
            {allTags
              .filter((t) => t !== tag)
              .map((t) => (
                <Link key={t} href={note_tag_path(t)}>
                  <Button variant="outline" size="sm">
                    #{t}
                  </Button>
                </Link>
              ))}
          </div>
        )}

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={post.urlPath}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-40 sm:h-44 md:h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <CardHeader>
                    <div className="text-sm text-muted-foreground mb-2">
                      <LocalTime dateTime={post.date} dateOnly />
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
            <p className="text-lg">No posts found in this {filterType}</p>
            <Link href={note_index_path()}>
              <Button variant="link" className="mt-2">
                View all posts
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
