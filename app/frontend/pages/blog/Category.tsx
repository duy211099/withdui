import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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

interface CategoryProps {
  category?: string
  tag?: string
  posts: Post[]
  all_categories?: string[]
  all_tags?: string[]
}

export default function Category({
  category,
  tag,
  posts,
  all_categories,
  all_tags,
}: CategoryProps) {
  const title = category ? `Category: ${category}` : `Tag: ${tag}`
  const filterType = category ? 'category' : 'tag'

  return (
    <>
      <Head title={title} />

      <div className="container mx-auto px-4 py-8">
        <Link href="/blog">
          <Button variant="ghost" className="mb-4">
            ← Back to Blog
          </Button>
        </Link>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-8">
          {posts.length} post{posts.length !== 1 ? 's' : ''}
        </p>

        {/* Filter Options */}
        {filterType === 'category' && all_categories && all_categories.length > 1 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground self-center mr-2">
              Other categories:
            </span>
            {all_categories
              .filter((c) => c !== category)
              .map((cat) => (
                <Link key={cat} href={`/blog/category/${cat}`}>
                  <Button variant="outline" size="sm">
                    {cat}
                  </Button>
                </Link>
              ))}
          </div>
        )}

        {filterType === 'tag' && all_tags && all_tags.length > 1 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground self-center mr-2">Other tags:</span>
            {all_tags
              .filter((t) => t !== tag)
              .map((t) => (
                <Link key={t} href={`/blog/tag/${t}`}>
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
            <Link href="/blog">
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
