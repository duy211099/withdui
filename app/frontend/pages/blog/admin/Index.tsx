import { Head, Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

interface Post {
  title: string
  slug: string
  date: string
  published: boolean
  category: string
}

interface AdminIndexProps {
  posts: Post[]
}

export default function AdminIndex({ posts }: AdminIndexProps) {
  const handleDelete = (slug: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      router.delete(`/blog/admin/${slug}`)
    }
  }

  return (
    <>
      <Head title="Manage Blog Posts" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Manage Blog Posts</h1>
            <p className="text-muted-foreground mt-2">
              {posts.length} total post{posts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/blog/admin/new">
            <Button size="lg">Create New Post</Button>
          </Link>
        </div>

        <div className="mb-4">
          <Link href="/blog">
            <Button variant="outline">View Blog</Button>
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.slug}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="mb-2">
                        {post.title}
                        {!post.published && (
                          <span className="ml-3 text-sm font-normal text-destructive bg-destructive/10 px-2 py-1 rounded">
                            Draft
                          </span>
                        )}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {new Date(post.date).toLocaleDateString()} • {post.category}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/blog/admin/${post.slug}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post.slug, post.title)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-lg text-muted-foreground mb-4">No blog posts yet</p>
            <Link href="/blog/admin/new">
              <Button>Create your first post</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
