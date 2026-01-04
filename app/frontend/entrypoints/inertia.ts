import './application.css'
import { createInertiaApp } from '@inertiajs/react'
import axios from 'axios'
import { createElement, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/components/Layout'

// Configure axios to include CSRF token in all requests
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
if (token) {
  axios.defaults.headers.common['X-CSRF-Token'] = token
  axios.defaults.headers.common.Accept = 'application/json'
}

// Temporary type definition, until @inertiajs/react provides one
type PageComponent = {
  layout?: (page: ReactNode) => ReactNode
}

type ResolvedComponent = {
  default: PageComponent
}

const MissingPage: PageComponent = () =>
  createElement(
    'div',
    { className: 'min-h-screen bg-background' },
    createElement(
      'div',
      { className: 'container mx-auto px-4 py-12 max-w-3xl space-y-3' },
      createElement('h1', { className: 'text-2xl font-bold' }, 'Page not found'),
      createElement(
        'p',
        { className: 'text-muted-foreground' },
        'The page you requested is missing or not registered yet.'
      )
    )
  )

MissingPage.layout = (page) => createElement(Layout, null, page)

createInertiaApp({
  // Set default page title
  // see https://inertia-rails.dev/guide/title-and-meta
  //
  title: (title) => (title ? `${title} - WithDui` : 'WithDui'),

  // Enable progress bar for page transitions
  // see https://inertia-rails.dev/guide/progress-indicators
  progress: {
    color: '#6b7280', // Gray-500 color
    showSpinner: true,
  },

  resolve: (name) => {
    const pages = import.meta.glob<ResolvedComponent>('../pages/**/*.tsx', {
      eager: true,
    })
    const page = pages[`../pages/${name}.tsx`]
    if (!page) {
      console.error(`Missing Inertia page component: '${name}.tsx'`)
      return { default: MissingPage }
    }

    // Use default layout for all pages (unless page specifies its own layout)
    // see https://inertia-rails.dev/guide/pages#default-layouts
    if (page && !page.default.layout) {
      page.default.layout = (page) => createElement(Layout, null, page)
    }

    return page
  },

  setup({ el, App, props }) {
    if (el) {
      createRoot(el).render(createElement(App, props))
    } else {
      console.error(
        'Missing root element.\n\n' +
          'If you see this error, it probably means you load Inertia.js on non-Inertia pages.\n' +
          'Consider moving <%= vite_typescript_tag "inertia" %> to the Inertia-specific layout instead.'
      )
    }
  },
})

const redirectToErrorPage = (event: Event) => {
  const detail = (event as CustomEvent<{ response?: { status?: number } }>).detail
  if (detail?.response?.status && detail.response.status >= 500) {
    window.location.assign('/500.html')
  }
}

document.addEventListener('inertia:exception', redirectToErrorPage)
document.addEventListener('inertia:invalid', redirectToErrorPage)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('Service worker registration failed', error)
    })
  })
}
