import { Link, router } from '@inertiajs/react'
import DeleteDialog from '@/components/DeleteDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/contexts/I18nContext'
import { edit_event_path, event_path, event_registrations_path, events_path } from '@/lib/routes'
import type { BasePageProps, Event } from '@/types'

interface IndexProps extends BasePageProps {
  event: Event
}

export default function Show({ event }: IndexProps) {
  const { t } = useI18n()

  return (
    <div className="min-h-[calc(100vh-120px)] bg-linear-to-b from-background via-background to-muted/40">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {t('frontend.events.show.label')}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold">{event.name}</h1>
            <p className="text-muted-foreground mt-1">{event.location}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {t('frontend.events.show.price_label')}
            </p>
            <p className="text-2xl font-semibold">
              {event.price === 0 ? t('frontend.events.index.price_free') : `$${event.price}`}
            </p>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle>{t('frontend.events.show.about_title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <p className="leading-relaxed text-foreground/90">{event.description}</p>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={events_path()}>{t('frontend.events.show.back')}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={event_registrations_path(event.id)}>View Registrations</Link>
              </Button>
              <Button asChild>
                <Link href={edit_event_path(event)}>{t('frontend.events.show.edit')}</Link>
              </Button>
              <DeleteDialog
                trigger={
                  <Button variant="destructive">{t('frontend.events.delete.trigger')}</Button>
                }
                title={t('frontend.events.delete.title')}
                description={t('frontend.events.delete.description')}
                cancelLabel={t('frontend.events.delete.cancel')}
                confirmLabel={t('frontend.events.delete.confirm')}
                onConfirm={() => router.delete(event_path(event.id))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
