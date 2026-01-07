import { Link } from '@inertiajs/react'
import useSWR from 'swr'
import { Card } from '@/components/ui/card'
import { fetcher } from '@/lib/fetcher'
import { event_path } from '@/lib/routes'
import type { BasePageProps, Event } from '@/types'

interface IndexProps extends BasePageProps {
  events: Event[]
}

interface RandomResponse {
  value: string
  generated_at: string
}

export default function Index({ events }: IndexProps) {
  const { data: randomData, isLoading, error } = useSWR<RandomResponse>('/random', fetcher)

  return (
    <div>
      {isLoading && <div className="mb-3 text-sm text-muted-foreground">Random: Loading...</div>}
      {error && !isLoading && (
        <div className="mb-3 text-sm text-muted-foreground">Random: Error!</div>
      )}
      {randomData && !isLoading && !error && (
        <div className="mb-3 text-sm text-muted-foreground">
          Random: <span className="font-medium text-foreground">{randomData.value}</span>
        </div>
      )}
      <ul className="space-y-2">
        {events.map((event, index) => {
          return (
            <Link href={event_path(event.id)} key={index.toString()} className="block">
              <Card className="p-4">
                <span>
                  <span className="text-lg font-semibold">{event.name}</span> in{' '}
                  <span className="text-lg font-semibold">{event.location}</span> ,{' '}
                  <span className="text-lg font-semibold">
                    {event.price == 0 ? 'Free' : `$${event.price}`}
                  </span>
                </span>
                <p>{event.description}</p>
              </Card>
            </Link>
          )
        })}
      </ul>
    </div>
  )
}
