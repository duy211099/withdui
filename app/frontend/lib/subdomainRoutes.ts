const KNOWN_SUBDOMAINS = new Set(['admin', 'notes', 'moods', 'events'])

export type AppSubdomain = 'admin' | 'notes' | 'moods' | 'events' | null

export const getBaseHost = (): string => {
  if (typeof window === 'undefined') {
    return ''
  }

  const { hostname } = window.location
  const hostParts = hostname.split('.')

  if (hostParts.length > 1 && KNOWN_SUBDOMAINS.has(hostParts[0])) {
    return hostParts.slice(1).join('.')
  }

  return hostname
}

export const getCookieDomain = (): string | undefined => {
  const baseHost = getBaseHost()
  if (!baseHost) {
    return undefined
  }

  return baseHost === 'localhost' ? '.localhost' : `.${baseHost}`
}

export const buildSubdomainUrl = (subdomain: AppSubdomain, path: string): string => {
  if (typeof window === 'undefined') {
    return path
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const { protocol, port } = window.location
  const baseHost = getBaseHost()

  const nextHost = subdomain ? `${subdomain}.${baseHost}` : baseHost
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const portPart = port ? `:${port}` : ''

  return `${protocol}//${nextHost}${portPart}${normalizedPath}`
}

export const adminUrl = (path: string) => buildSubdomainUrl('admin', path)
export const notesUrl = (path: string) => buildSubdomainUrl('notes', path)
export const moodsUrl = (path: string) => buildSubdomainUrl('moods', path)
export const eventsUrl = (path: string) => buildSubdomainUrl('events', path)
export const rootUrl = (path: string) => buildSubdomainUrl(null, path)
