import { usePage, Link } from '@inertiajs/react'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Button } from './ui/button'

interface User {
  id: number
  email: string
  name?: string
  avatar_url?: string
}

export default function Header() {
  const { current_user } = usePage<{ current_user?: User }>().props

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          WithDui
        </Link>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          {current_user ? (
            <div className="flex items-center gap-3">
              {current_user.avatar_url && (
                <img
                  src={current_user.avatar_url}
                  alt={current_user.name || current_user.email}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <span className="text-sm">{current_user.name || current_user.email}</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/users/sign_out" method="delete" as="button">
                  Sign Out
                </Link>
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/users/sign_in">
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
