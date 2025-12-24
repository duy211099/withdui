import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/contexts/I18nContext'

export default function LocaleSwitcher() {
  const { locale, availableLocales, t } = useI18n()

  // Debug: log current state
  console.log('LocaleSwitcher state:', { locale, availableLocales, localeType: typeof locale })

  const switchLocale = (newLocale: string) => {
    console.log('Switching locale to:', {
      newLocale,
      currentLocale: locale,
      url: `/locale/${newLocale}`,
    })
    if (newLocale === locale) return

    // POST to the locale switching endpoint
    router.post(
      `/locale/${newLocale}`,
      {},
      {
        preserveState: false,
        preserveScroll: true,
      }
    )
  }

  const getLocaleName = (loc: string) => {
    const key = loc === 'en' ? 'english' : 'vietnamese'
    const name = t(`frontend.locale.${key}`)
    console.log('getLocaleName:', { loc, key, name })
    return name
  }

  const getFlag = (loc: string) => {
    return loc === 'en' ? '🇺🇸' : '🇻🇳'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <span className="text-xl leading-none">{getFlag(locale)}</span>
          <span className="sr-only">{t('frontend.locale.switch_language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLocales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchLocale(loc)}
            className={locale === loc ? 'bg-accent' : ''}
          >
            <span className="mr-2 text-base">{getFlag(loc)}</span>
            <span>{getLocaleName(loc)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
