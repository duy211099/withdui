import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { getCookieDomain } from '@/lib/subdomainRoutes'

const THEME_COOKIE = 'theme'
const YEAR_IN_SECONDS = 60 * 60 * 24 * 365
const ALLOWED_THEMES = new Set(['light', 'dark', 'system'])

const readCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

const writeCookie = (name: string, value: string) => {
  if (typeof document === 'undefined') {
    return
  }

  const domain = getCookieDomain()
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'path=/',
    `max-age=${YEAR_IN_SECONDS}`,
    'samesite=lax',
  ]

  if (domain) {
    parts.push(`domain=${domain}`)
  }

  document.cookie = parts.join('; ')
}

export default function ThemeCookieSync() {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const cookieValue = readCookie(THEME_COOKIE)
    if (cookieValue && ALLOWED_THEMES.has(cookieValue) && cookieValue !== theme) {
      setTheme(cookieValue)
    }
  }, [])

  useEffect(() => {
    if (!theme || !ALLOWED_THEMES.has(theme)) {
      return
    }
    writeCookie(THEME_COOKIE, theme)
  }, [theme])

  return null
}
