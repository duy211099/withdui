import type { BasePageProps, Event } from '@/types'

interface IndexProps extends BasePageProps {
  events: Event[]
}

export default function Index({ events }: IndexProps) {
  return (
    <div>
      <h1>Dui's age: {Math.floor(Math.random() * 100)}</h1>
      <ul className="space-y-2">
        {events.map((event, index) => {
          return (
            <div className="container p-4 border rounded" key={index.toString()}>
              <span>
                {event.name} in {event.location}, ${event.price}
              </span>
              <p>{event.description}</p>
            </div>
          )
        })}
      </ul>
    </div>
  )
}
