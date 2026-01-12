import { Link } from '@inertiajs/react'
import { BookOpen, Calendar, Home, Info, Smile, Trophy, Wrench, X } from 'lucide-react'
import { useTranslation } from '@/contexts/I18nContext'
import {
  about_path,
  destroy_user_session_path,
  gamification_dashboard_path,
  life_weeks_path,
  moods_path,
  new_user_session_path,
  note_index_path,
  root_path,
  utils_index_path,
} from '@/lib/routes'
import type { User, UserStats } from '@/types'
import LocaleSwitcher from './LocaleSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  currentUser?: User | null
  userStats?: UserStats | null
}

export default function MobileMenu({ isOpen, onClose, currentUser, userStats }: MobileMenuProps) {
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
            {currentUser && (
              <>
                <Link
                  href={moods_path()}
                  className="flex items-center gap-3 text-base font-medium hover:text-primary transition-colors py-2"
                  onClick={onClose}
                >
                  <Smile className="h-5 w-5" />
                  <span>Moods</span>
                </Link>
                <Link
                  href={life_weeks_path()}
                  className="flex items-center gap-3 text-base font-medium hover:text-primary transition-colors py-2"
                  onClick={onClose}
                >
                  <Calendar className="h-5 w-5" />
                  <span>{t('frontend.header.life_weeks')}</span>
                </Link>
              </>
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
            {currentUser ? (
              <div className="space-y-3">
                {/* User info */}
                <div className="flex items-center gap-2">
                  {currentUser.avatarUrl && (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name || currentUser.email}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="text-sm truncate">{currentUser.name || currentUser.email}</span>
                </div>

                {/* Gamification level indicator */}
                {userStats && (
                  <Link
                    href={gamification_dashboard_path()}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm font-semibold text-primary">
                          Level {userStats.currentLevel}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {userStats.totalPoints} points
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {userStats.currentMoodStreak > 0 && (
                        <span className="flex items-center gap-1">
                          🔥 {userStats.currentMoodStreak}
                        </span>
                      )}
                    </div>
                  </Link>
                )}

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
