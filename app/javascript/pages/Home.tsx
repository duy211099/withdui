import { Head, usePage } from '@inertiajs/react'
import type { PageProps as InertiaPageProps } from '@inertiajs/core'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface User {
  id: number
  email: string
  name: string
  avatar_url?: string
}

interface PageProps extends InertiaPageProps {
  current_user: User | null
}

export default function Home() {
  const { current_user } = usePage<PageProps>().props

  const handleSignOut = () => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/users/sign_out'

    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content
    if (csrfToken) {
      const csrfInput = document.createElement('input')
      csrfInput.type = 'hidden'
      csrfInput.name = 'authenticity_token'
      csrfInput.value = csrfToken
      form.appendChild(csrfInput)
    }

    const methodInput = document.createElement('input')
    methodInput.type = 'hidden'
    methodInput.name = '_method'
    methodInput.value = 'delete'
    form.appendChild(methodInput)

    document.body.appendChild(form)
    form.submit()
  }

  return (
    <>
      <Head title="Home" />
      <div className="min-h-screen bg-background">
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Withdui</h1>
            <div className="flex items-center gap-4">
              {current_user ? (
                <>
                  <div className="flex items-center gap-2">
                    {current_user.avatar_url && (
                      <img
                        src={current_user.avatar_url}
                        alt={current_user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium">{current_user.name}</span>
                  </div>
                  <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <a href="/users/sign_in">Sign In</a>
                </Button>
              )}
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Welcome to Withdui</CardTitle>
              <CardDescription>
                {current_user
                  ? `You are signed in as ${current_user.email}`
                  : 'Please sign in to continue'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {current_user ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    You have successfully authenticated with Google OAuth2.
                  </p>
                  <div className="grid gap-2">
                    <div>
                      <span className="font-semibold">Name:</span> {current_user.name}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span> {current_user.email}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Click the Sign In button above to authenticate with your Google account.
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  )
}
