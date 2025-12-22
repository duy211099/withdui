import { Link, usePage } from '@inertiajs/react'
import { useTranslation } from '@/contexts/I18nContext'
import LocaleSwitcher from './LocaleSwitcher'
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
  const { t } = useTranslation()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex gap-4">
          <Link href="/" className="text-xl font-bold">
            {t('frontend.header.app_name')}
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              {t('frontend.header.blog')}
            </Link>
          </nav>
          <nav className="flex items-center gap-6">
            <Link
              href="/utils"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t('frontend.header.utils')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
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
                  {t('frontend.header.sign_out')}
                </Link>
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/users/sign_in">{t('frontend.header.sign_in')}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
