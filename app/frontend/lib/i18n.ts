import { I18n } from 'i18n-js'
import translations from '../../javascript/locales/translations.json'

// Create i18n instance
const i18n = new I18n(translations)

// Default locale
i18n.defaultLocale = 'vi'
i18n.locale = 'vi'

// Enable fallbacks
i18n.enableFallback = true

// Export the i18n instance
export default i18n

// Export a type-safe translate function
export function t(key: string, options?: Record<string, unknown>) {
  return i18n.t(key, options)
}

// Helper to set the current locale
export function setLocale(locale: string) {
  console.log('setLocale called:', { requestedLocale: locale, currentLocale: i18n.locale })
  if (['en', 'vi'].includes(locale)) {
    i18n.locale = locale
    console.log('setLocale success:', { newLocale: i18n.locale })
  } else {
    console.warn('setLocale rejected:', { invalidLocale: locale })
  }
}

// Helper to get current locale
export function getLocale() {
  return i18n.locale
}
