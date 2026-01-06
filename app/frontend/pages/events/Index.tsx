import type { BasePageProps, Event } from '@/types'

interface IndexProps extends BasePageProps {
  events: Event[]
}

export default function Index({ events }: IndexProps) {
  return (
    <div>
      <h1>Dui's age: {Math.floor(Math.random() * 100)}</h1>
      <ul>
        {events.map((event, index) => {
          return (
            <div key={index.toString()}>
              <span>
                {event.name} in {event.location}, ${event.price}
              </span>
            </div>
          )
        })}
      </ul>
    </div>
  )
}
