import { Head, usePage } from '@inertiajs/react'
import type { PageProps as InertiaPageProps } from '@inertiajs/core'
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
  return (
    <>
      <Head title="Home" />
      <div className="min-h-screen bg-background">

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
