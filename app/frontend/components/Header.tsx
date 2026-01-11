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
import ProgressBar from './gamification/ProgressBar'
import LocaleSwitcher from './LocaleSwitcher'
import MobileMenu from './MobileMenu'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function Header() {
  const { currentUser, userStats } = usePage<{ currentUser?: User; userStats?: UserStats }>().props
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

          {currentUser ? (
            <div className="flex items-center gap-3">
              {userStats && (
                <Link
                  href={gamification_dashboard_path()}
                  className="group flex flex-col gap-1 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 transition-all"
                  title="View gamification dashboard"
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-primary">
                      Level {userStats.currentLevel}
                    </span>
                    <span className="text-xs text-muted-foreground hidden lg:inline">
                      • {userStats.totalPoints} pts
                    </span>
                  </div>
                  {/* Mini progress bar */}
                  <div className="w-full bg-primary/10 rounded-full h-1 overflow-hidden">
                    <div
                      className="h-1 bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${userStats.levelProgress}%` }}
                    />
                  </div>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex border-2 items-center gap-2 px-2 py-1 rounded-md hover:bg-accent transition-colors"
                  >
                    {currentUser.avatarUrl && (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name || currentUser.email}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="text-sm hidden lg:inline">
                      {currentUser.name || currentUser.email}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden lg:inline" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-0" align="end" sideOffset={8}>
                  <div className="flex flex-col">
                    {/* User info header */}
                    <div className="px-3 py-3 bg-muted/30">
                      <div className="flex items-center gap-3 mb-3">
                        {currentUser.avatarUrl && (
                          <img
                            src={currentUser.avatarUrl}
                            alt={currentUser.name || currentUser.email}
                            className="h-12 w-12 rounded-full ring-2 ring-border"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {currentUser.name || currentUser.email}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>

                      {/* Level progress */}
                      {userStats && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                              Level {userStats.currentLevel}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {userStats.pointsToNextLevel} pts to next
                            </span>
                          </div>
                          <ProgressBar
                            current={userStats.levelProgress}
                            max={100}
                            showPercentage={false}
                            className="mb-0"
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-1">
                      {/* Menu items */}
                      <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                        <UserIcon className="size-4 text-muted-foreground" />
                        <span>Profile</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                        <Settings className="size-4 text-muted-foreground" />
                        <span>Settings</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                        <HelpCircle className="size-4 text-muted-foreground" />
                        <span>Help</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Logout button */}
                      <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
                        <Link
                          href={destroy_user_session_path()}
                          method="delete"
                          as="button"
                          className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors text-left w-full"
                        >
                          <LogOut className="size-4" />
                          <span>{t('frontend.header.sign_out')}</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
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
        currentUser={currentUser}
        userStats={userStats}
      />
    </header>
  )
}
