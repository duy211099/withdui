import { Head, Link, router } from '@inertiajs/react'
import LocalTime from '@/components/LocalTime'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/contexts/I18nContext'
import { edit_note_admin_path, new_note_admin_path, note_index_path } from '@/lib/routes'
import type { PostAdminListItem } from '@/types'

interface AdminIndexProps {
  posts: PostAdminListItem[]
}

export default function AdminIndex({ posts }: AdminIndexProps) {
  const { t } = useTranslation()
  const handleDelete = (slug: string, title: string) => {
    if (confirm(t('frontend.note.admin.delete_confirm', { title }))) {
      router.delete(`/note/me/${slug}`)
    }
  }

  return (
    <>
      <Head title={t('frontend.note.admin.title')} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              {t('frontend.note.admin.heading')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('frontend.note.admin.total', { count: posts.length })}
            </p>
          </div>
          <Link href={new_note_admin_path()}>
            <Button size="lg">{t('frontend.note.admin.create')}</Button>
          </Link>
        </div>

        <div className="mb-4">
          <Link href={note_index_path()}>
            <Button variant="outline">{t('frontend.note.admin.view_public')}</Button>
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
                            {t('frontend.note.admin.draft')}
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
                          {t('frontend.note.admin.edit')}
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post.slug, post.title)}
                      >
                        {t('frontend.note.admin.delete')}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-lg text-muted-foreground mb-4">{t('frontend.note.admin.empty')}</p>
            <Link href={new_note_admin_path()}>
              <Button>{t('frontend.note.admin.create_first')}</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
