# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

**Backend:**
- Ruby 3.4.7 + Rails 8.1.1
- SQLite3 database
- Puma web server

**Frontend:**
- React 19.2.0 + TypeScript 5.9.3
- Inertia.js 2.2.15 (server-driven reactive frontend)
- Vite 7.1.12 (bundler) + vite-plugin-ruby
- Tailwind CSS 4.1.16 (CSS-in-JS with native @import syntax)
- shadcn/ui component system

**Development:**
- Overmind/Foreman process manager
- RuboCop with rails-omakase style guide
- TypeScript strict mode enabled

## Architecture Overview

This is a **server-side React application** using Inertia.js, not a traditional SPA:

- **Rails** serves pages and controls routing
- **Inertia.js** bridges Rails controllers to React components
- **React components** receive props from Rails and handle interactivity
- **Vite** compiles TypeScript/React; Rails serves the compiled assets

### Directory Structure

```
app/
├── javascript/           # Vite source directory (configured in config/vite.json)
│   ├── entrypoints/     # Build entry points
│   │   ├── inertia.ts   # Inertia app setup & page resolver
│   │   ├── application.css  # Tailwind imports & theme config
│   │   └── application.js   # Hotwire setup (if needed)
│   └── pages/           # Inertia page components (auto-loaded by glob)
│       ├── InertiaExample.tsx
│       └── v1/Hello.tsx
│
└── frontend/            # Shared component library (imported via @/ alias)
    ├── components/ui/   # shadcn/ui components
    └── lib/utils.ts     # Utility functions (cn, etc.)
```

**Why two directories?**
- `app/javascript/` is the Vite build source
- `app/frontend/` is a reusable component library accessible via `@/` alias
- Both are scanned by Tailwind and TypeScript

### Inertia.js Page Resolution

Pages are resolved via Vite glob in `app/javascript/entrypoints/inertia.ts`:

```typescript
const pages = import.meta.glob<ResolvedComponent>('../pages/**/*.tsx', { eager: true })
const page = pages[`../pages/${name}.tsx`]
```

**Flow:**
1. Rails controller: `render inertia: "InertiaExample", props: { name: "World" }`
2. Inertia finds matching component: `app/javascript/pages/InertiaExample.tsx`
3. React component receives props and renders

**Adding a new page:**
1. Create `.tsx` file in `app/javascript/pages/`
2. Add route in `config/routes.rb`
3. Add controller action that calls `render inertia: "PageName"`

## Development Workflow

### Starting the dev server

```bash
bin/dev  # Runs both Vite dev server (port 3036) and Rails (port 3000)
```

The `bin/dev` script uses overmind/hivemind/foreman to run `Procfile.dev`:
- `vite: bin/vite dev` - Vite dev server with HMR
- `web: bin/rails s` - Rails server

### Key commands

```bash
# Type checking
npm run check              # Check TypeScript without emitting

# Ruby linting
rubocop                    # Run RuboCop style checker

# Asset compilation
bin/vite build             # Build production assets

# Database
bin/rails db:migrate       # Run migrations
bin/rails db:seed          # Seed database

# Rails console
bin/rails c                # Open Rails console
```

### Hot Module Replacement (HMR)

- **React/TypeScript changes**: Auto-reload via Vite HMR
- **CSS changes**: Auto-reload via Tailwind JIT
- **Rails controller/model changes**: Require manual server restart

## Important Configuration Files

### Frontend Build

- `vite.config.ts` - Vite configuration with React, Tailwind, and Ruby plugins
  - Sets `@/` alias to `./app/frontend`
  - Configures path resolution for imports

- `tsconfig.json` - Root TypeScript config with project references
- `tsconfig.app.json` - App TypeScript config (strict mode, includes both app/javascript and app/frontend)
- `tsconfig.node.json` - Vite config TypeScript types

- `config/vite.json` - Vite Ruby configuration
  - `sourceCodeDir: "app/javascript"`
  - Development port: 3036
  - Test port: 3037

### Rails Configuration

- `config/routes.rb` - Application routes
- `config/initializers/inertia_rails.rb` - Inertia.js setup and version tracking
- `config/application.rb` - Rails app initialization

### Styling

- `app/javascript/entrypoints/application.css` - **Main Tailwind configuration**
  - Uses Tailwind v4 syntax: `@import "tailwindcss"`
  - `@source` directives tell Tailwind where to scan for classes:
    ```css
    @source "../**/*.{js,ts,jsx,tsx}";      # Scans app/javascript/
    @source "../../frontend/**/*.{js,ts,jsx,tsx}";  # Scans app/frontend/
    ```
  - Theme configuration with CSS variables for design tokens
  - Custom variant for dark mode: `@custom-variant dark (&:is(.dark *))`

- `components.json` - shadcn/ui configuration for component generation

## Tailwind CSS v4 Specifics

**Key differences from v3:**
- No `tailwind.config.js` file (configuration in CSS)
- Use `@source` directive to specify scan paths
- Use `@theme inline` for design tokens
- Use `@plugin` for plugins instead of config file
- Automatic content detection via `@tailwindcss/vite` plugin

**Adding Tailwind classes:**
- Classes are automatically scanned from files in `@source` paths
- No need to update config when adding new classes
- JIT compilation happens automatically

## Import Path Conventions

**Use the `@/` alias for app/frontend imports:**

```typescript
// Good
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Avoid
import { Button } from '../../app/frontend/components/ui/button'
```

**Relative imports for local files:**

```typescript
// In app/javascript/pages/
import styles from './InertiaExample.module.css'
```

## Adding shadcn/ui Components

The project uses shadcn/ui with configuration in `components.json`:

```bash
# Add a new component
npx shadcn-ui@latest add [component-name]
```

Components are installed to `app/frontend/components/ui/` and use the `@/` alias.

**Important:** shadcn components require:
1. Tailwind CSS properly configured (already done)
2. `cn()` utility from `@/lib/utils`
3. CSS imported in Inertia entrypoint: `import './application.css'` in `inertia.ts`

## Common Patterns

### Creating an Inertia Page

1. **Create the page component** in `app/javascript/pages/`:

```typescript
// app/javascript/pages/UserProfile.tsx
import { Head } from '@inertiajs/react'

export default function UserProfile({ user }: { user: { name: string } }) {
  return (
    <>
      <Head title={`${user.name}'s Profile`} />
      <div>
        <h1>{user.name}</h1>
      </div>
    </>
  )
}
```

2. **Add route** in `config/routes.rb`:

```ruby
get 'users/:id', to: 'users#show'
```

3. **Create controller action**:

```ruby
class UsersController < ApplicationController
  def show
    user = User.find(params[:id])
    render inertia: 'UserProfile', props: {
      user: { name: user.name }
    }
  end
end
```

### Using Shared Components

Import from `@/components`:

```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function MyPage() {
  return (
    <div className={cn('p-4', 'bg-background')}>
      <Button variant="default" size="lg">
        Click me
      </Button>
    </div>
  )
}
```

## Troubleshooting

### TypeScript path resolution errors

If you see "Cannot find module '@/...'" errors:

1. Check `tsconfig.app.json` has correct paths in `compilerOptions`:
   ```json
   "paths": {
     "@/*": ["./app/frontend/*"]
   }
   ```

2. Check `vite.config.ts` has matching alias:
   ```typescript
   resolve: {
     alias: {
       '@': path.resolve(__dirname, './app/frontend'),
     },
   }
   ```

3. Restart TypeScript language server in your editor

### Tailwind classes not working

If Tailwind classes appear in HTML but have no effect:

1. Check `@source` paths in `app/javascript/entrypoints/application.css`
2. Verify CSS is imported in `inertia.ts`: `import './application.css'`
3. Restart Vite dev server (`bin/dev`)
4. Check browser console for CSS loading errors

### Inertia page not found

If you get "Missing Inertia page component" error:

1. Verify file exists at exact path: `app/javascript/pages/${name}.tsx`
2. Check page name matches controller render call exactly (case-sensitive)
3. Restart dev server (glob patterns are cached)

## Layout and Asset Loading

The main layout is `app/views/layouts/application.html.erb`:

```erb
<%= vite_stylesheet_tag "application" %>
<%= vite_react_refresh_tag %>
<%= vite_client_tag %>
<%= vite_typescript_tag "inertia" %>
```

**Key helper tags:**
- `vite_client_tag` - Vite dev client for HMR
- `vite_react_refresh_tag` - React Fast Refresh
- `vite_typescript_tag "inertia"` - Loads the Inertia.js entrypoint
- `vite_stylesheet_tag "application"` - Loads Tailwind CSS

## Code Style

**Ruby:**
- Follow `rubocop-rails-omakase` style guide
- 2-space indentation
- Run `rubocop` before committing

**TypeScript:**
- Strict mode enabled
- No unused locals or parameters
- Use `npm run check` to validate types
- Prefer named exports over default exports (except for pages)

## Hybrid Rendering

This app supports both traditional Rails ERB views and Inertia React pages:

- **ERB pages**: Use traditional Rails rendering (e.g., `home#index` at `/`)
- **Inertia pages**: Use React components (e.g., `/inertia-example`, `/hello`)

The layout file includes both Hotwire and Inertia assets, allowing gradual migration.
