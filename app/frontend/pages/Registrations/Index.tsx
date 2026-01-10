import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { event_path } from '@/lib/routes'
import type { BasePageProps, Registration } from '@/types'

interface IndexProps extends BasePageProps {
  event: {
    id: string
    name: string
  }
  registrations: Registration[]
}

export default function Index({ event, registrations }: IndexProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatEventDate = (dateString: string | null) => {
    if (!dateString) return 'Date TBD'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <Head title={`Registrations - ${event.name}`} />
      <div className="min-h-[calc(100vh-120px)] bg-linear-to-b from-background via-background to-muted/40">
        <div className="container mx-auto px-4 py-10 max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex-1">
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                Event Registrations
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold">{event.name}</h1>
              <p className="text-muted-foreground mt-1">All registrations for this event</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href={event_path(event.id)}>Back to Event</Link>
              </Button>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Total Registrations
                </p>
                <p className="text-2xl font-bold">{registrations.length}</p>
              </div>
            </div>
          </div>

          {registrations.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No registrations yet. Check back soon!
              </CardContent>
            </Card>
          ) : (
            <ul className="grid gap-4">
              {registrations.map((registration) => (
                <li key={registration.id}>
                  <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{registration.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{registration.email}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Registered {formatDate(registration.created_at)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                            Event
                          </p>
                          <Link
                            href={event_path(registration.event.id)}
                            className="font-medium text-primary hover:underline"
                          >
                            {registration.event.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {formatEventDate(registration.event.starts_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                            How They Heard
                          </p>
                          <p className="font-medium">{registration.how_heard}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
