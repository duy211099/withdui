import { Link } from '@inertiajs/react'
import { BookOpen, Home, Info, Smile, Wrench, X } from 'lucide-react'
import { useTranslation } from '@/contexts/I18nContext'
import {
  about_path,
  destroy_user_session_path,
  moods_path,
  new_user_session_path,
  note_index_path,
  root_path,
  utils_index_path,
} from '@/lib/routes'
import type { User } from '@/types'
import LocaleSwitcher from './LocaleSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  current_user?: User | null
}

export default function MobileMenu({ isOpen, onClose, current_user }: MobileMenuProps) {
  const { t } = useTranslation()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-64 bg-card border-l-2 p-0 [&>button]:hidden">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          {/* Close button */}
          <div className="flex justify-end px-4 py-3 border-b-2 border-border">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="rounded hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </SheetHeader>

        {/* Navigation links */}
        <nav className="flex flex-col p-4">
          <div className="space-y-2">
            <Link
              href={root_path()}
              className="flex items-center gap-3 text-base font-medium hover:text-primary transition-colors py-2"
              onClick={onClose}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              href={note_index_path()}
              className="flex items-center gap-3 text-base font-medium hover:text-primary transition-colors py-2"
              onClick={onClose}
            >
              <BookOpen className="h-5 w-5" />
              <span>{t('frontend.header.blog')}</span>
            </Link>
            <Link
              href={about_path()}
              className="flex items-center gap-3 text-base font-medium hover:text-primary transition-colors py-2"
              onClick={onClose}
            >
              <Info className="h-5 w-5" />
              <span>{t('frontend.header.about')}</span>
            </Link>
            <Link
              href={utils_index_path()}
              className="flex items-center gap-3 text-base font-medium hover:text-primary transition-colors py-2"
              onClick={onClose}
            >
              <Wrench className="h-5 w-5" />
              <span>{t('frontend.header.utils')}</span>
            </Link>
            {current_user && (
              <Link
                href={moods_path()}
                className="flex items-center gap-3 text-base font-medium hover:text-primary transition-colors py-2"
                onClick={onClose}
              >
                <Smile className="h-5 w-5" />
                <span>Moods</span>
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="border-t-2 border-border py-4 mt-2">
            <div className="flex gap-2">
              <LocaleSwitcher />
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
                  <Link href={destroy_user_session_path()} method="delete" as="button">
                    {t('frontend.header.sign_out')}
                  </Link>
                </Button>
              </div>
            ) : (
              <Button variant="default" size="default" asChild className="w-full">
                <Link href={new_user_session_path()}>{t('frontend.header.sign_in')}</Link>
              </Button>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
