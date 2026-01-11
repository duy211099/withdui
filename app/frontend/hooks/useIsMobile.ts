import { useEffect, useState } from 'react'

/**
 * Responsive helper that reports whether the viewport matches the provided media query.
 * Defaults to mobile breakpoint at 640px.
 */
export function useIsMobile(query = '(max-width: 640px)') {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)

    // Set initial value on mount
    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return isMobile
}
