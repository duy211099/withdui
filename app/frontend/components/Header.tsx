import { Link, usePage } from '@inertiajs/react'
import {
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
  Settings,
  Trophy,
  User as UserIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '@/contexts/I18nContext'
import useScrollHide from '@/hooks/useScrollHide'
import {
  about_path,
  destroy_user_session_path,
  events_path,
  gamification_dashboard_path,
  moods_path,
  new_user_session_path,
  note_index_path,
  root_path,
} from '@/lib/routes'
import type { User, UserStats } from '@/types'
import LocaleSwitcher from './LocaleSwitcher'
import MobileMenu from './MobileMenu'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export default function Header() {
  const { current_user, user_stats } = usePage<{ current_user?: User; user_stats?: UserStats }>()
    .props
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
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between max-w-6xl">
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
              {user_stats && (
                <Link
                  href={gamification_dashboard_path()}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
                  title="View gamification dashboard"
                >
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">
                    Lv {user_stats.current_level}
                  </span>
                  <span className="text-xs text-muted-foreground hidden lg:inline">
                    • {user_stats.total_points} pts
                  </span>
                </Link>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex border-2 items-center gap-2 px-2 py-1 rounded-md hover:bg-accent transition-colors"
                  >
                    {current_user.avatar_url && (
                      <img
                        src={current_user.avatar_url}
                        alt={current_user.name || current_user.email}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="text-sm hidden lg:inline">
                      {current_user.name || current_user.email}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden lg:inline" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-1" align="end">
                  <div className="flex flex-col">
                    {/* User info header */}
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">
                        {current_user.name || current_user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{current_user.email}</p>
                    </div>

                    <div className="bg-border -mx-1 my-1 h-px" />

                    {/* Menu items */}
                    <button
                      type="button"
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors text-left opacity-50 cursor-not-allowed"
                    >
                      <UserIcon className="size-4 text-muted-foreground" />
                      <span>Profile</span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors text-left opacity-50 cursor-not-allowed"
                    >
                      <Settings className="size-4 text-muted-foreground" />
                      <span>Settings</span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors text-left opacity-50 cursor-not-allowed"
                    >
                      <HelpCircle className="size-4 text-muted-foreground" />
                      <span>Help</span>
                    </button>

                    <div className="bg-border -mx-1 my-1 h-px" />

                    {/* Logout button */}
                    <Link
                      href={destroy_user_session_path()}
                      method="delete"
                      as="button"
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors text-left text-destructive"
                    >
                      <LogOut className="size-4" />
                      <span>{t('frontend.header.sign_out')}</span>
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
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
        user_stats={user_stats}
      />
    </header>
  )
}
