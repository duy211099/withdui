import { Link } from '@inertiajs/react'
import { X } from 'lucide-react'
import { useEffect } from 'react'
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

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  current_user?: User | null
}

export default function MobileMenu({ isOpen, onClose, current_user }: MobileMenuProps) {
  const { t } = useTranslation()

  // ESC key handler and prevent body scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden' // Prevent scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-card border-l-2 border-border z-50
          transform transition-transform duration-300 ease-in-out md:hidden ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Close button */}
        <div className="flex justify-end px-4 py-3 border-b-2 border-border">
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-muted rounded"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col p-4 space-y-4">
          <Link
            href="/blog"
            className="text-base font-medium hover:text-primary transition-colors py-2"
            onClick={onClose}
          >
            {t('frontend.header.blog')}
          </Link>
          <Link
            href="/utils"
            className="text-base font-medium hover:text-primary transition-colors py-2"
            onClick={onClose}
          >
            {t('frontend.header.utils')}
          </Link>

          {/* Divider */}
          <div className="border-t-2 border-border pt-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {t('frontend.header.language')}:
              </span>
              <LocaleSwitcher />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{t('frontend.header.theme')}:</span>
              <ThemeSwitcher />
            </div>
          </div>

          {/* Auth section */}
          <div className="border-t-2 border-border pt-4">
            {current_user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {current_user.avatar_url && (
                    <img
                      src={current_user.avatar_url}
                      alt={current_user.name || current_user.email}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="text-sm truncate">
                    {current_user.name || current_user.email}
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/users/sign_out" method="delete" as="button">
                    {t('frontend.header.sign_out')}
                  </Link>
                </Button>
              </div>
            ) : (
              <Button variant="default" size="default" asChild className="w-full">
                <Link href="/users/sign_in">{t('frontend.header.sign_in')}</Link>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}
