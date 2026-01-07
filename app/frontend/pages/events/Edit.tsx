import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { event_path } from '@/lib/routes'
import type { BasePageProps, Event } from '@/types'

interface IndexProps extends BasePageProps {
  event: Event
}

export default function Edit({ event }: IndexProps) {
  const { data, setData, patch, processing } = useForm({
    name: event.name,
    location: event.location,
    price: event.price,
    description: event.description ?? '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    patch(event_path(event.id))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Event</h1>
      <Card>
        <CardHeader>
          <CardTitle>Event details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={data.price}
                onChange={(e) => setData('price', Number(e.target.value))}
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
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
