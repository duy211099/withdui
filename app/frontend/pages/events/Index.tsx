import { Link } from '@inertiajs/react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/contexts/I18nContext'
import { fetcher } from '@/lib/fetcher'
import { event_path, new_event_path } from '@/lib/routes'
import type { BasePageProps, Event } from '@/types'

interface IndexProps extends BasePageProps {
  events: Event[]
}

interface RandomResponse {
  value: string
  generated_at: string
}

export default function Index({ events }: IndexProps) {
  const { t } = useI18n()
  const { data: randomData, isLoading, error } = useSWR<RandomResponse>('/random', fetcher)

  return (
    <div className="min-h-[calc(100vh-120px)] bg-linear-to-b from-background via-background to-muted/40">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {t('frontend.events.index.title')}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold">
              {t('frontend.events.index.subtitle')}
            </h1>
            <p className="text-muted-foreground mt-1">{t('frontend.events.index.description')}</p>
          </div>
          <Link href={new_event_path()}>
            <Button>{t('frontend.events.form.submit_new')}</Button>
          </Link>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {t('frontend.events.index.pulse')}
            </p>
            {isLoading && (
              <p className="text-sm text-muted-foreground">
                {t('frontend.events.index.random.loading')}
              </p>
            )}
            {error && !isLoading && (
              <p className="text-sm text-muted-foreground">
                {t('frontend.events.index.random.error')}
              </p>
            )}
            {randomData && !isLoading && !error && (
              <p className="text-sm text-muted-foreground">
                {t('frontend.events.index.random.value', { value: randomData.value })}
              </p>
            )}
          </div>
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              {t('frontend.events.index.empty')}
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <li key={event.slug}>
                <Link href={event_path(event.slug)} className="block h-full">
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          {event.price == 0
                            ? t('frontend.events.index.price_free')
                            : `$${event.price}`}
                        </span>
                        <Button variant="outline" size="sm">
                          {t('frontend.events.index.view_details')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
