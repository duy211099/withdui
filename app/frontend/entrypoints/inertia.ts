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

createInertiaApp({
  // Set default page title
  // see https://inertia-rails.dev/guide/title-and-meta
  //
  // title: title => title ? `${title} - App` : 'App',

  // Disable progress bar
  //
  // see https://inertia-rails.dev/guide/progress-indicators
  // progress: false,

  resolve: (name) => {
    const pages = import.meta.glob<ResolvedComponent>('../pages/**/*.tsx', {
      eager: true,
    })
    const page = pages[`../pages/${name}.tsx`]
    if (!page) {
      console.error(`Missing Inertia page component: '${name}.tsx'`)
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
