import { Link } from '@inertiajs/react'
import { Card } from '@/components/ui/card'
import { event_path } from '@/lib/routes'
import type { BasePageProps, Event } from '@/types'

interface IndexProps extends BasePageProps {
  events: Event[]
}

export default function Index({ events }: IndexProps) {
  return (
    <div>
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
