import { Head, Link, useForm } from '@inertiajs/react'
import { useEffect } from 'react'
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
  }
  registration: RegistrationForm
  how_heard_options: string[]
  is_edit: boolean
}

export default function Form({ event, registration, how_heard_options, is_edit }: FormProps) {
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

    if (is_edit && registration.id) {
      put(event_registration_path(event.id, registration.id))
    } else {
      post(event_registrations_path(event.id))
    }
  }

  return (
    <>
      <Head title={is_edit ? 'Edit Registration' : 'New Registration'} />
      <div className="min-h-[calc(100vh-120px)] bg-linear-to-b from-background via-background to-muted/40">
        <div className="container mx-auto px-4 py-10 max-w-2xl">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">{event.name}</p>
            <h1 className="text-3xl sm:text-4xl font-bold">
              {is_edit ? 'Edit Registration' : 'New Registration'}
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
                  <select
                    id="registration-how-heard"
                    name="how_heard"
                    aria-invalid={Boolean(errors?.how_heard)}
                    aria-describedby={
                      errors?.how_heard ? 'registration-how-heard-error' : undefined
                    }
                    value={data.how_heard}
                    onChange={(e) => setData('how_heard', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="">Select an option...</option>
                    {how_heard_options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors?.how_heard && (
                    <p id="registration-how-heard-error" className="text-sm text-destructive">
                      {errors.how_heard}
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button type="submit" disabled={processing}>
                    {is_edit ? 'Update Registration' : 'Create Registration'}
                  </Button>
                  <Button asChild variant="outline" type="button">
                    <Link href={event_registrations_path(event.id)}>Cancel</Link>
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
