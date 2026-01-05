import type { BasePageProps } from '@/types'

interface IndexProps extends BasePageProps {
  events: string[]
}

export default function Index({ events }: IndexProps) {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 max-w-5xl">
      <h1>Dui's age: {Math.floor(Math.random() * 100)}</h1>
      <ul>
        {events.map((item, index) => {
          return <li key={index.toString()}>{item}</li>
        })}
      </ul>
    </div>
  )
}
