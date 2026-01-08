import { Head, Link, router } from '@inertiajs/react'
import LocalTime from '@/components/LocalTime'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { edit_note_admin_path, new_note_admin_path, note_index_path } from '@/lib/routes'
import type { PostAdminListItem } from '@/types'

interface AdminIndexProps {
  posts: PostAdminListItem[]
}

export default function AdminIndex({ posts }: AdminIndexProps) {
  const handleDelete = (slug: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      router.delete(`/note/me/${slug}`)
    }
  }

  return (
    <>
      <Head title="Manage Notes" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Manage Notes</h1>
            <p className="text-muted-foreground mt-2">
              {posts.length} total note{posts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href={new_note_admin_path()}>
            <Button size="lg">Create New Note</Button>
          </Link>
        </div>

        <div className="mb-4">
          <Link href={note_index_path()}>
            <Button variant="outline">View Notes</Button>
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
                        <LocalTime dateTime={post.date} dateOnly /> • {post.category}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={edit_note_admin_path(post.slug)}>
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
            <p className="text-lg text-muted-foreground mb-4">No notes yet</p>
            <Link href={new_note_admin_path()}>
              <Button>Create your first note</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
