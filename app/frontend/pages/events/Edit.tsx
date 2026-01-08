import { useForm } from '@inertiajs/react'
import EventForm from '@/components/events/EventForm'
import { useI18n } from '@/contexts/I18nContext'
import { event_path } from '@/lib/routes'
import type { BasePageProps, Event } from '@/types'

interface IndexProps extends BasePageProps {
  event: Event
}

export default function Edit({ event }: IndexProps) {
  const { t } = useI18n()
  const { data, setData, patch, processing, errors } = useForm({
    name: event.name ?? '',
    location: event.location ?? '',
    price: event.price ?? 0,
    description: event.description ?? '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    patch(event_path(event.id))
  }

  return (
    <EventForm
      title={t('frontend.events.form.edit_title')}
      submitLabel={t('frontend.events.form.submit_edit')}
      data={data}
      errors={errors}
      processing={processing}
      onSubmit={handleSubmit}
      setData={setData}
    />
  )
}
