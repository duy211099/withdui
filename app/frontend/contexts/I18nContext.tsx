import { createContext, useContext, ReactNode, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import i18n, { setLocale } from '@/lib/i18n'

interface I18nContextType {
  t: (key: string, options?: Record<string, unknown>) => string
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

  // Sync i18n locale with Rails locale synchronously during render
  // This ensures translations work correctly on first render
  if (props.locale && i18n.locale !== props.locale) {
    setLocale(props.locale)
  }

  // Use useMemo to recreate context value when locale changes
  // This ensures consuming components re-render with new translations
  const value: I18nContextType = useMemo(() => ({
    t: (key: string, options?: Record<string, unknown>) => i18n.t(key, options),
    locale: props.locale || 'vi',
    availableLocales: props.available_locales || ['vi', 'en'],
    setLocale,
  }), [props.locale, props.available_locales])

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
