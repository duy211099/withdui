import { createContext, useContext, useEffect, ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import { t as translate, setLocale } from '@/lib/i18n'

interface I18nContextType {
  t: typeof translate
  locale: string
  availableLocales: string[]
  setLocale: typeof setLocale
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const { props } = usePage<{
    locale: string
    available_locales: string[]
  }>()

  // Debug: log Inertia props
  console.log('I18nProvider Inertia props:', {
    locale: props.locale,
    available_locales: props.available_locales,
    localeType: typeof props.locale
  })

  // Sync i18n locale with Rails locale from Inertia props
  useEffect(() => {
    if (props.locale) {
      console.log('Setting i18n locale to:', props.locale)
      setLocale(props.locale)
    }
  }, [props.locale])

  const value: I18nContextType = {
    t: translate,
    locale: props.locale || 'en',
    availableLocales: props.available_locales || ['en', 'vi'],
    setLocale,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// Convenience hook for just getting the translate function
export function useTranslation() {
  const { t } = useI18n()
  return { t }
}
