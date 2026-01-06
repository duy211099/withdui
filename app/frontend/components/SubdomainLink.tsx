import { Link } from '@inertiajs/react'
import type { ComponentProps, ReactNode } from 'react'

type SubdomainLinkProps = {
  href: string
  children: ReactNode
} & Omit<ComponentProps<typeof Link>, 'href'>

const isSameOrigin = (href: string) => {
  if (typeof window === 'undefined') {
    return true
  }

  if (!href.startsWith('http://') && !href.startsWith('https://')) {
    return true
  }

  try {
    const target = new URL(href, window.location.href)
    return target.origin === window.location.origin
  } catch {
    return true
  }
}

export default function SubdomainLink({ href, children, ...props }: SubdomainLinkProps) {
  if (isSameOrigin(href)) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} {...(props as ComponentProps<'a'>)}>
      {children}
    </a>
  )
}
