import { Link, usePage } from '@inertiajs/react'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '@/contexts/I18nContext'
import useScrollHide from '@/hooks/useScrollHide'
import {
  about_path,
  destroy_user_session_path,
  events_path,
  moods_path,
  new_user_session_path,
  note_index_path,
  root_path,
} from '@/lib/routes'
import type { User } from '@/types'
import LocaleSwitcher from './LocaleSwitcher'
import MobileMenu from './MobileMenu'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Button } from './ui/button'

export default function Header() {
  const { current_user } = usePage<{ current_user?: User }>().props
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const hidden = useScrollHide({ threshold: 80 })

  return (
    <header
      className={[
        'sticky top-0 z-40 border-b-2 bg-background/90 backdrop-blur transition-transform duration-300',
        hidden ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between max-w-5xl">
        <div className="flex gap-4">
          <Link href={root_path()} className="text-xl font-bold">
            {t('frontend.header.app_name')}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={about_path()}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t('frontend.header.about')}
            </Link>
            <Link
              href={note_index_path()}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t('frontend.header.blog')}
            </Link>
            <Link
              href={moods_path()}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t('frontend.header.moods')}
            </Link>
            <Link
              href={events_path()}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t('frontend.header.events')}
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
                <Link href={destroy_user_session_path()} method="delete" as="button">
                  {t('frontend.header.sign_out')}
                </Link>
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href={new_user_session_path()}>{t('frontend.header.sign_in')}</Link>
            </Button>
          )}
        </div>

        {/* Hamburger menu - visible only on mobile */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden -mr-2 rounded hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
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
