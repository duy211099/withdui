import { Head, Link, useForm } from '@inertiajs/react'
import { useEffect } from 'react'
import { Dropdown } from '@/components/Dropdown'
import { UserDropdown } from '@/components/UserDropdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { event_registration_path, event_registrations_path } from '@/lib/routes'
import type { BasePageProps, RegistrationForm } from '@/types'

interface FormProps extends BasePageProps {
  event: {
    id: string
    name: string
    slug: string
  }
  registration: RegistrationForm
  howHeardOptions: string[]
  isEdit: boolean
}

export default function Form({ event, registration, howHeardOptions, isEdit }: FormProps) {
  const { data, setData, post, put, processing, errors } = useForm({
    user_id: registration.userId || '',
    how_heard: registration.howHeard || '',
  })

  const fieldOrder: Array<{ key: string; id: string }> = [
    { key: 'user_id', id: 'registration-user-id' },
    { key: 'how_heard', id: 'registration-how-heard' },
  ]

  useEffect(() => {
    if (!errors) return

    const firstError = fieldOrder.find(({ key }) => key in errors)
    if (!firstError) return

    const element = document.getElementById(firstError.id)
    if (!element) return

    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (element instanceof HTMLElement) {
      element.focus()
    }
  }, [errors])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEdit && registration.id) {
      put(event_registration_path(event.slug, registration.id))
    } else {
      post(event_registrations_path(event.slug))
    }
  }

  return (
    <>
      <Head title={isEdit ? 'Edit Registration' : 'New Registration'} />
      <div className="min-h-[calc(100vh-120px)] bg-linear-to-b from-background via-background to-muted/40">
        <div className="container mx-auto px-4 py-10 max-w-2xl">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">{event.name}</p>
            <h1 className="text-3xl sm:text-4xl font-bold">
              {isEdit ? 'Edit Registration' : 'New Registration'}
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registration Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Selection */}
                <div className="space-y-2">
                  <Label htmlFor="registration-user">
                    User <span className="text-destructive">*</span>
                  </Label>
                  <UserDropdown
                    value={data.user_id}
                    onValueChange={(value) => setData('user_id', value)}
                    placeholder="Select a user..."
                    disabled={processing}
                  />
                  {errors?.user_id && (
                    <p id="registration-user-error" className="text-sm text-destructive">
                      {errors.user_id}
                    </p>
                  )}
                </div>

                {/* How Heard Field */}
                <div className="space-y-2">
                  <Label htmlFor="registration-how-heard">
                    How did you hear about this event? <span className="text-destructive">*</span>
                  </Label>
                  <Dropdown
                    value={data.how_heard}
                    onValueChange={(value) => setData('how_heard', value)}
                    options={howHeardOptions}
                    placeholder="Select an option..."
                    searchPlaceholder="Search options..."
                    disabled={processing}
                  />
                  {errors?.how_heard && (
                    <p id="registration-how-heard-error" className="text-sm text-destructive">
                      {errors.how_heard}
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button type="submit" disabled={processing}>
                    {isEdit ? 'Update Registration' : 'Create Registration'}
                  </Button>
                  <Button asChild variant="outline" type="button">
                    <Link href={event_registrations_path(event.slug)}>Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
