import { Link, usePage } from '@inertiajs/react'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '@/contexts/I18nContext'
import type { User } from '@/types'
import LocaleSwitcher from './LocaleSwitcher'
import MobileMenu from './MobileMenu'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Button } from './ui/button'

export default function Header() {
  const { current_user } = usePage<{ current_user?: User }>().props
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b-2">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between max-w-5xl">
        <div className="flex gap-4">
          <Link href="/" className="text-xl font-bold">
            {t('frontend.header.app_name')}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t('frontend.header.about')}
            </Link>
            <Link href="/note" className="text-sm font-medium hover:text-primary transition-colors">
              {t('frontend.header.blog')}
            </Link>
            <Link
              href="/moods"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Moods
            </Link>
          </nav>
        </div>

        {/* Desktop controls - hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
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
              <span className="text-sm hidden md:inline">
                {current_user.name || current_user.email}
              </span>
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

        {/* Hamburger menu - visible only on mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 -mr-2 hover:bg-muted rounded"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu component */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        current_user={current_user}
      />
    </header>
  )
}
