import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setData: <K extends keyof EventFormData>(key: K, value: EventFormData[K]) => void
}

export default function EventForm({
  title,
  submitLabel,
  data,
  processing,
  onSubmit,
  setData,
}: EventFormProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Event details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">Name</Label>
              <Input
                id="event-name"
                type="text"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                type="text"
                name="location"
                value={data.location}
                onChange={(e) => setData('location', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-price">Price</Label>
              <Input
                id="event-price"
                type="number"
                name="price"
                min={0}
                value={data.price}
                onChange={(e) => {
                  const nextValue = Number(e.target.value)
                  setData('price', Number.isNaN(nextValue) ? 0 : Math.max(0, nextValue))
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                name="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={4}
              />
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
