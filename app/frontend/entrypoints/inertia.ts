import './application.css'
import { createInertiaApp } from '@inertiajs/react'
import axios from 'axios'
import { createElement, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from '@/components/ErrorBoundary'
import Layout from '@/components/Layout'

const showFatalError = (message: string) => {
  const app = document.getElementById('app')
  const loading = document.getElementById('app-loading')
  if (loading) loading.style.display = 'none'
  if (!app) return

  app.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
      <div style="max-width:560px;text-align:center;">
        <h1 style="font-size:22px;margin:0 0 8px;">Something went wrong</h1>
        <p style="margin:0;color:#6b7280;">${message}</p>
      </div>
    </div>
  `
}

window.addEventListener('error', (event) => {
  showFatalError(event.message || 'Check the browser console for details.')
})

window.addEventListener('unhandledrejection', () => {
  showFatalError('Check the browser console for details.')
})

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
    // showSpinner: true,
  },

  defaults: {
    future: {
      useScriptElementForInitialPage: true,
    },
  },

  resolve: async (name) => {
    // Lazy load pages for automatic code splitting
    // Each page becomes its own chunk, loaded only when needed
    const pages = import.meta.glob<ResolvedComponent>('../pages/**/*.tsx')
    const pageLoader = pages[`../pages/${name}.tsx`]

    if (!pageLoader) {
      console.error(`Missing Inertia page component: '${name}.tsx'`)
      return { default: MissingPage }
    }

    const page = await pageLoader()

    // Use default layout for all pages (unless page specifies its own layout)
    // see https://inertia-rails.dev/guide/pages#default-layouts
    if (page && !page.default.layout) {
      page.default.layout = (page) => createElement(Layout, null, page)
    }

    return page
  },

  setup({ el, App, props }) {
    if (el) {
      createRoot(el).render(createElement(ErrorBoundary, null, createElement(App, props)))
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

// Temporarily disable service worker registration to simplify debugging.
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js').catch((error) => {
//       console.warn('Service worker registration failed', error)
//     })
//   })
// }
