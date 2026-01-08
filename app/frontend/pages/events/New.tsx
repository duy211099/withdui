import { useForm } from '@inertiajs/react'
import EventForm from '@/components/events/EventForm'
import { useI18n } from '@/contexts/I18nContext'
import { events_path } from '@/lib/routes'
import type { BasePageProps, Event } from '@/types'

interface IndexProps extends BasePageProps {
  event: Event
}

export default function New({ event }: IndexProps) {
  const { t } = useI18n()
  const { data, setData, post, processing, errors } = useForm({
    name: event.name ?? '',
    location: event.location ?? '',
    price: event.price ?? 0,
    description: event.description ?? '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(events_path())
  }

  return (
    <EventForm
      title={t('frontend.events.form.new_title')}
      submitLabel={t('frontend.events.form.submit_new')}
      data={data}
      errors={errors}
      processing={processing}
      onSubmit={handleSubmit}
      setData={setData}
    />
  )
}
