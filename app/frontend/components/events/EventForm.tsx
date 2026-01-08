import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/contexts/I18nContext'

type EventFormData = {
  name: string
  location: string
  price: number
  description: string
}

interface EventFormProps {
  title: string
  submitLabel: string
  data: EventFormData
  processing: boolean
  errors?: Partial<Record<keyof EventFormData, string>>
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setData: <K extends keyof EventFormData>(key: K, value: EventFormData[K]) => void
}

export default function EventForm({
  title,
  submitLabel,
  data,
  processing,
  errors,
  onSubmit,
  setData,
}: EventFormProps) {
  const { t } = useI18n()
  const fieldOrder: Array<{ key: keyof EventFormData; id: string }> = [
    { key: 'name', id: 'event-name' },
    { key: 'location', id: 'event-location' },
    { key: 'price', id: 'event-price' },
    { key: 'description', id: 'event-description' },
  ]

  useEffect(() => {
    if (!errors) return

    const firstError = fieldOrder.find(({ key }) => errors[key])
    if (!firstError) return

    const element = document.getElementById(firstError.id)
    if (!element) return

    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (element instanceof HTMLElement) {
      element.focus()
    }
  }, [errors])

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('frontend.events.form.details_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">{t('frontend.events.form.name')}</Label>
              <Input
                id="event-name"
                type="text"
                name="name"
                aria-invalid={Boolean(errors?.name)}
                aria-describedby={errors?.name ? 'event-name-error' : undefined}
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              {errors?.name && (
                <p id="event-name-error" className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-location">{t('frontend.events.form.location')}</Label>
              <Input
                id="event-location"
                type="text"
                name="location"
                aria-invalid={Boolean(errors?.location)}
                aria-describedby={errors?.location ? 'event-location-error' : undefined}
                value={data.location}
                onChange={(e) => setData('location', e.target.value)}
              />
              {errors?.location && (
                <p id="event-location-error" className="text-sm text-destructive">
                  {errors.location}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-price">{t('frontend.events.form.price')}</Label>
              <Input
                id="event-price"
                type="number"
                name="price"
                min={0}
                aria-invalid={Boolean(errors?.price)}
                aria-describedby={errors?.price ? 'event-price-error' : undefined}
                value={data.price}
                onChange={(e) => {
                  const nextValue = Number(e.target.value)
                  setData('price', Number.isNaN(nextValue) ? 0 : Math.max(0, nextValue))
                }}
              />
              {errors?.price && (
                <p id="event-price-error" className="text-sm text-destructive">
                  {errors.price}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">{t('frontend.events.form.description')}</Label>
              <Textarea
                id="event-description"
                name="description"
                aria-invalid={Boolean(errors?.description)}
                aria-describedby={errors?.description ? 'event-description-error' : undefined}
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={4}
              />
              {errors?.description && (
                <p id="event-description-error" className="text-sm text-destructive">
                  {errors.description}
                </p>
              )}
            </div>
            <Button type="submit" disabled={processing}>
              {submitLabel}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
