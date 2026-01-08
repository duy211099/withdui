import { useForm } from '@inertiajs/react'
import EventForm from '@/components/events/EventForm'
import { events_path } from '@/lib/routes'
import type { BasePageProps, Event } from '@/types'

interface IndexProps extends BasePageProps {
  event: Event
}

export default function New({ event }: IndexProps) {
  const { data, setData, post, processing } = useForm({
    name: event.name,
    location: event.location,
    price: event.price ?? 0,
    description: event.description ?? '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(events_path())
  }

  return (
    <EventForm
      title="New Event"
      submitLabel="Create event"
      data={data}
      processing={processing}
      onSubmit={handleSubmit}
      setData={setData}
    />
  )
}
