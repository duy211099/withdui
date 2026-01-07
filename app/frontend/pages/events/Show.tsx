import type { BasePageProps, Event } from '@/types'

interface IndexProps extends BasePageProps {
  event: Event
}

export default function Show({ event }: IndexProps) {
  return (
    <div className="container p-4 border rounded">
      <span>
        <span className="text-lg font-semibold">{event.name}</span> in{' '}
        <span className="text-lg font-semibold">{event.location}</span> ,{' '}
        <span className="text-lg font-semibold">
          {event.price == 0 ? 'Free' : `$${event.price}`}
        </span>
      </span>
      <p>{event.description}</p>
    </div>
  )
}
