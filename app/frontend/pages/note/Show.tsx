import { Head, Link } from '@inertiajs/react'
import { lazy, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import type { Post } from '@/types'

const MDXRenderer = lazy(() => import('@/components/note/MDXRenderer'))

interface NoteShowProps {
  post: Post
  related_posts: Post[]
}

export default function NoteShow({ post, related_posts }: NoteShowProps) {
  // Preserve the view mode when going back
  const getBackUrl = () => {
    const savedView = typeof window !== 'undefined' ? localStorage.getItem('noteViewMode') : null
    return savedView === 'graph' ? '/note?view=graph' : '/note'
  }

  return (
    <>
      <Head title={post.title} />

      <article className="container mx-auto px-3 sm:px-4 py-6 md:py-8 w-full max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <Link href={getBackUrl()}>
            <Button variant="ghost" className="mb-4">
              ← Back to Notes
            </Button>
          </Link>

          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg mb-6"
            />
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>

          <div className="flex gap-4 text-muted-foreground text-sm mb-4 flex-wrap">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.author || 'A Philosopher 🧙‍♂️'}</span>
            {post.category && (
              <>
                <span>•</span>
                <Link
                  href={`/note/category/${post.category}`}
                  className="hover:underline hover:text-primary"
                >
                  {post.category}
                </Link>
              </>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/note/tag/${tag}`}>
                  <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm hover:bg-secondary/80 transition-colors">
                    #{tag}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* MDX Content */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8">
              <div className="animate-pulse text-muted-foreground">Loading content...</div>
            </div>
          }
        >
          <MDXRenderer content={post.content} />
        </Suspense>

        {/* Related Posts */}
        {related_posts && related_posts.length > 0 && (
          <aside className="mt-12 pt-8 border-t">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-3 md:gap-4">
              {related_posts.map((p) => (
                <Link key={p.url_path} href={p.url_path}>
                  <div className="p-4 border rounded hover:shadow-md transition-shadow h-full">
                    <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </article>
    </>
  )
}
