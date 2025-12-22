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

**Authentication:**
- Devise for authentication framework
- Google OAuth2 via omniauth-google-oauth2
- Environment variables via dotenv-rails (development/test only)

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
app/frontend/            # Single unified frontend directory (configured in config/vite.json)
├── entrypoints/         # Build entry points
│   ├── inertia.ts       # Inertia app setup & page resolver
│   └── application.css  # Tailwind imports & theme config
├── pages/               # Inertia page components (auto-loaded by glob)
│   ├── InertiaExample.tsx
│   ├── Home.tsx
│   ├── auth/
│   ├── blog/
│   ├── utils/
│   └── v1/
├── components/          # Shared component library
│   ├── ui/              # shadcn/ui components
│   ├── Layout.tsx
│   ├── Header.tsx
│   └── ...
├── lib/                 # Utility functions
│   ├── utils.ts         # cn() helper
│   └── i18n.ts          # i18n configuration
├── contexts/            # React contexts
├── locales/             # i18n translations
└── assets/              # Static assets (SVGs, etc.)
```

**Why a single directory?**
- Simpler mental model: all frontend code in one place
- Easier imports: no confusion about directory boundaries
- Consistent @/ alias: points to the entire frontend codebase
- All files scanned by Tailwind, TypeScript, and linters
- **No importmap** - Everything bundled through Vite

### Inertia.js Page Resolution

Pages are resolved via Vite glob in `app/frontend/entrypoints/inertia.ts`:

```typescript
const pages = import.meta.glob<ResolvedComponent>('../pages/**/*.tsx', { eager: true })
const page = pages[`../pages/${name}.tsx`]
```

**Flow:**
1. Rails controller: `render inertia: "InertiaExample", props: { name: "World" }`
2. Inertia finds matching component: `app/frontend/pages/InertiaExample.tsx`
3. React component receives props and renders

**Adding a new page:**
1. Create `.tsx` file in `app/frontend/pages/`
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
  - **Security**: Source maps disabled in production builds to prevent code exposure

- `tsconfig.json` - Root TypeScript config with project references
- `tsconfig.app.json` - App TypeScript config (strict mode, includes app/frontend)
- `tsconfig.node.json` - Vite config TypeScript types

- `config/vite.json` - Vite Ruby configuration
  - `sourceCodeDir: "app/frontend"`
  - Development port: 3036
  - Test port: 3037

### Rails Configuration

- `config/routes.rb` - Application routes
- `config/initializers/inertia_rails.rb` - Inertia.js setup and version tracking
  - **Note:** Shared props (like `current_user`) were removed. Add them back if needed via `config.share`
- `config/initializers/devise.rb` - Devise authentication configuration
  - Google OAuth2 credentials loaded from ENV variables
- `config/application.rb` - Rails app initialization

### Styling

- `app/frontend/entrypoints/application.css` - **Main Tailwind configuration**
  - Uses Tailwind v4 syntax: `@import "tailwindcss"`
  - `@source` directive tells Tailwind where to scan for classes:
    ```css
    @source "../**/*.{js,ts,jsx,tsx}";  # Scans all of app/frontend/
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
// In app/frontend/pages/
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

## Authentication

This app uses **Devise with Google OAuth2** for authentication.

### Environment Variables

Required environment variables (set in `.env` for development):
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**Important:** Never commit `.env` file. Use `.env.example` as a template.

### User Model

The User model (`app/models/user.rb`) includes:
- Standard Devise modules: `:database_authenticatable, :registerable, :recoverable, :rememberable, :validatable`
- OmniAuth module: `:omniauthable, omniauth_providers: [:google_oauth2]`
- OAuth fields: `provider`, `uid`, `name`, `avatar_url`
- `from_omniauth` class method for OAuth callback handling

### Authentication Flow

1. User clicks "Sign In" → redirects to `/users/sign_in`
2. Custom sessions controller renders Inertia page: `auth/Login`
3. Login page uses POST request with CSRF token to `/users/auth/google_oauth2`
4. OmniAuth redirects to Google OAuth consent screen
5. Google redirects back to `/users/auth/google_oauth2/callback`
6. `Users::OmniauthCallbacksController` handles callback via `from_omniauth`
7. User is signed in and redirected to home page

### Custom Controllers

- `app/controllers/users/sessions_controller.rb` - Custom sessions controller for Inertia integration
- `app/controllers/users/omniauth_callbacks_controller.rb` - Handles Google OAuth2 callbacks

### CSRF Protection

The app uses `omniauth-rails_csrf_protection` gem, which requires:
- OAuth requests must be POST (not GET)
- Must include CSRF token in the request
- Direct browser access to `/users/auth/google_oauth2` will show "Authentication passthru" error

### Accessing Current User

In controllers:
```ruby
current_user  # Devise helper
user_signed_in?  # Check if user is authenticated
```

To pass user data to Inertia pages, add to `config/initializers/inertia_rails.rb`:
```ruby
config.share do |controller|
  {
    current_user: controller.current_user&.as_json(only: [:id, :email, :name, :avatar_url])
  }
end
```

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

### Authentication passthru error

If you see "Not found. Authentication passthru." when accessing OAuth URLs:

1. **Never access OAuth URLs directly in browser** - they require POST with CSRF token
2. Use the proper authentication flow (sign in button → login page → OAuth button)
3. Verify environment variables are set (restart server after adding `.env`)
4. Check Google Cloud Console redirect URI matches your app's callback URL

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

- **ERB pages**: Use traditional Rails rendering (controller renders view directly)
- **Inertia pages**: Use React components (controller uses `render inertia: "PageName"`)

The layout file includes both Hotwire and Inertia assets, allowing gradual migration.

## Google OAuth Setup

For detailed Google OAuth2 setup instructions, see `GOOGLE_OAUTH_SETUP.md` which includes:
- Creating a Google Cloud project
- Configuring OAuth consent screen
- Creating OAuth 2.0 credentials
- Setting up authorized redirect URIs
- Troubleshooting common OAuth errors

**Quick setup:**
1. Get credentials from Google Cloud Console
2. Copy `.env.example` to `.env`
3. Add your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
4. Restart the Rails server
5. Add callback URL to Google Cloud Console: `http://localhost:3000/users/auth/google_oauth2/callback` (adjust port if needed)
