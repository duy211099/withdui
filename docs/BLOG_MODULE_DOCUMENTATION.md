# Blog Module Documentation

**Version 1.1.0** | Last Updated: December 19, 2024

## Overview

A complete MDX-powered blog system with file-based routing, built for Rails 8.1 + Inertia.js + React application. This module allows you to write blog posts in MDX format (Markdown + JSX) and manage them through both file system and a web-based admin interface.

### What's New in v1.1.0

- 🇻🇳 **Vietnamese Slug Generator**: Comprehensive Vietnamese diacritic mapping for URL-friendly slugs (à → a, đ → d, etc.)
- 🔗 **Header Navigation**: Blog link added to main header for easy access
- 🐛 **8 Bug Fixes**: All implementation errors documented with solutions (see [Troubleshooting](#troubleshooting))
- 📚 **Enhanced Documentation**: Complete troubleshooting guide with causes and fixes for all encountered errors

## Features

### Core Features
- ✅ **File-based blog posts** - Posts stored as `.mdx` files in `app/content/posts/`
- ✅ **Directory-based routing** - `app/content/posts/2024/my-post.mdx` → `/blog/2024/my-post`
- ✅ **MDX support** - Write markdown with React components
- ✅ **Full-text search** - Client-side search using FlexSearch
- ✅ **Categories & tags** - Organize and filter posts
- ✅ **Admin UI** - Create, edit, and delete posts via web interface
- ✅ **Public blog** - No authentication required to read posts
- ✅ **Vietnamese slug generator** - Auto-generate URL-friendly slugs from Vietnamese text with diacritics
- ✅ **Header navigation** - Blog link integrated in main app header
- ✅ **Tailwind Typography** - Beautiful, responsive typography
- ✅ **Dark mode** - Automatic dark mode support
- ✅ **GFM tables** - GitHub Flavored Markdown tables
- ✅ **Syntax highlighting** - Code blocks with language support
- ✅ **Auto-linking headings** - Automatic heading anchors

### Security Features
- ✅ Strict slug validation (prevents directory traversal)
- ✅ Authentication required for admin routes
- ✅ CSRF protection enabled
- ✅ Secure file writing with validation

## Architecture

### Technology Stack

**Backend:**
- Ruby 3.4.7
- Rails 8.1.1
- ActiveModel (for BlogPost service)
- YAML frontmatter parsing

**Frontend:**
- React 19.2.0
- TypeScript 5.9.3
- Inertia.js 2.2.15
- MDX runtime compilation
- FlexSearch for search
- Tailwind CSS 4.1.16 + Typography plugin

**MDX Processing:**
- `@mdx-js/mdx` - Runtime MDX compilation
- `@mdx-js/react` - React MDX integration
- `remark-gfm` - GitHub Flavored Markdown (tables, strikethrough, etc.)
- `rehype-slug` - Auto-generate heading IDs
- `rehype-autolink-headings` - Auto-link headings

### Data Flow

```
.mdx files → BlogPost service → Rails Controller → Inertia → React Components → MDXRenderer → Rendered HTML
```

1. **File Storage**: Blog posts stored in `app/content/posts/{year}/{slug}.mdx`
2. **Parsing**: `BlogPost` service parses frontmatter and content
3. **Caching**: Posts cached for 1 hour (Rails.cache)
4. **Rendering**: MDX compiled at runtime in browser with remark/rehype plugins
5. **Styling**: Tailwind Typography `prose` classes

## File Structure

```
app/
├── content/posts/              # Blog post files
│   ├── 2024/
│   │   ├── welcome-to-the-blog.mdx
│   │   └── rails-inertia-best-practices.mdx
│   └── 2025/
│       └── mdx-features-guide.mdx
│
├── controllers/
│   ├── blog_controller.rb                    # Public blog routes
│   └── blog_admin_controller.rb              # Admin CRUD routes
│
├── services/
│   ├── blog_post.rb                          # Post parsing & caching
│   ├── blog_search_index.rb                  # Search index builder
│   └── blog_post_writer.rb                   # Secure file writer
│
├── frontend/
│   ├── components/
│   │   ├── blog/
│   │   │   └── MDXRenderer.tsx               # MDX runtime compiler
│   │   └── Header.tsx                        # Main header (includes Blog link)
│   └── lib/
│       └── slugify.ts                        # Vietnamese slug generator
│
└── javascript/pages/blog/
    ├── Index.tsx                             # Post listing
    ├── Show.tsx                              # Single post view
    ├── Category.tsx                          # Category/tag filter
    └── admin/
        ├── Index.tsx                         # Admin dashboard
        ├── New.tsx                           # Create post form
        └── Edit.tsx                          # Edit post form
```

## Installation

### 1. NPM Packages

The following packages were installed:

```bash
npm install @mdx-js/mdx @mdx-js/react @mdx-js/rollup \
  remark-gfm rehype-slug rehype-autolink-headings \
  flexsearch
```

**Note**: We don't need `gray-matter` because:
- Ruby side uses `YAML.safe_load` for frontmatter parsing
- React side receives already-parsed data from Rails (no client-side parsing needed)

### 2. Vite Configuration

Updated `vite.config.ts` to support MDX:

```typescript
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    }),
    react(),
    tailwindcss(),
    RubyPlugin(),
  ],
  // ... other config
})
```

### 3. Rails Configuration

Updated `config/application.rb` to autoload services:

```ruby
config.autoload_paths << Rails.root.join("app/services")
config.eager_load_paths << Rails.root.join("app/services")
```

### 4. Routes

Added to `config/routes.rb`:

```ruby
# Blog admin routes (authenticated) - must come before wildcard routes
get "blog/admin", to: "blog_admin#index", as: :blog_admin_index
get "blog/admin/new", to: "blog_admin#new", as: :new_blog_admin
post "blog/admin", to: "blog_admin#create"
get "blog/admin/:slug/edit", to: "blog_admin#edit", as: :edit_blog_admin
patch "blog/admin/:slug", to: "blog_admin#update"
delete "blog/admin/:slug", to: "blog_admin#destroy"

# Blog routes (public)
get "blog", to: "blog#index", as: :blog_index
get "blog/category/:category", to: "blog#category", as: :blog_category
get "blog/tag/:tag", to: "blog#tag", as: :blog_tag
get "blog/:year/:slug", to: "blog#show", as: :blog_post
```

### 5. Shadcn UI Components

Added form components:

```bash
npx shadcn@latest add input label textarea checkbox switch
```

### 6. i18n Translations

Added to `config/locales/en.yml` and `vi.yml`:

```yaml
blog:
  post_not_found: Post not found
  admin:
    post_created: Post created successfully
    post_updated: Post updated successfully
    post_deleted: Post deleted successfully

frontend:
  header:
    blog: Blog  # Added for navigation link
```

### 7. Header Navigation

Updated `app/frontend/components/Header.tsx` to include Blog navigation link:

```typescript
<nav className="flex items-center gap-6">
  <Link
    href="/blog"
    className="text-sm font-medium hover:text-primary transition-colors"
  >
    {t('frontend.header.blog')}
  </Link>
</nav>
```

## Usage

### Creating Blog Posts

#### Method 1: Web Admin UI

1. **Sign in** to your application (Devise authentication required)
2. Navigate to `/blog/admin`
3. Click **"Create New Post"**
4. Fill out the form:
   - **Title**: Post title (auto-generates slug)
   - **Slug**: URL-friendly identifier (e.g., `my-post-title`)
   - **Date**: Publication date
   - **Excerpt**: Brief description
   - **Category**: Category name
   - **Tags**: Comma-separated tags
   - **Author**: Author name
   - **Published**: Toggle to publish/unpublish
   - **Content**: MDX markdown content
5. Click **"Create Post"**

#### Method 2: Direct File Creation

Create a new `.mdx` file in `app/content/posts/{year}/`:

```mdx
---
title: "My Awesome Post"
slug: "my-awesome-post"
date: "2024-12-18"
excerpt: "A brief description of the post"
category: "Tutorial"
tags: ["rails", "react", "mdx"]
author: "Your Name"
published: true
featured_image: "/images/blog/my-image.jpg"
---

# My Awesome Post

This is the content of your post written in **MDX**!

## Features

- Markdown formatting
- React components
- Tables
- Code blocks

## Code Example

\`\`\`ruby
class BlogPost
  def hello
    puts "Hello from MDX!"
  end
end
\`\`\`

## Tables

| Feature | Status |
|---------|--------|
| Tables  | ✅ Working |
| Code    | ✅ Working |
```

### Frontmatter Schema

All `.mdx` files must include frontmatter with the following fields:

```yaml
---
title: string          # Post title (required)
slug: string           # URL slug (required, must be [a-z0-9-_] only)
date: string           # ISO date "2024-12-18" (required)
excerpt: string        # Brief description (optional)
category: string       # Category name (optional)
tags: array            # Array of tags (optional)
author: string         # Author name (optional)
published: boolean     # true/false (default: true)
featured_image: string # Image URL (optional)
---
```

### Accessing the Blog

- **Blog index**: `http://localhost:3000/blog` (also accessible via "Blog" link in header navigation)
- **Single post**: `http://localhost:3000/blog/2024/my-post-slug`
- **Category filter**: `http://localhost:3000/blog/category/Tutorial`
- **Tag filter**: `http://localhost:3000/blog/tag/rails`
- **Admin dashboard**: `http://localhost:3000/blog/admin` (requires authentication)

**Navigation**: A "Blog" link has been added to the main header for easy access from anywhere in the application.

### Search Functionality

The blog includes client-side full-text search:

1. Navigate to `/blog`
2. Use the search box at the top
3. Search indexes: title, excerpt, and content
4. Results update instantly as you type

### Categories & Tags

**Categories**: Single category per post for primary organization

**Tags**: Multiple tags per post for cross-referencing

Filter by clicking category/tag buttons or navigating to:
- `/blog/category/{category-name}`
- `/blog/tag/{tag-name}`

## MDX Features

### Supported Markdown Syntax

```markdown
# Headings (H1-H6)

**Bold** and *italic* text

- Bullet lists
- Numbered lists

[Links](https://example.com)

> Blockquotes

`Inline code`

\`\`\`language
Code blocks
\`\`\`

| Tables | Are | Supported |
|--------|-----|-----------|
| With   | GFM | Plugin    |

---
Horizontal rules
```

### GitHub Flavored Markdown (GFM)

Enabled via `remark-gfm`:
- ✅ Tables
- ✅ Strikethrough (`~~text~~`)
- ✅ Autolinks
- ✅ Task lists (in code blocks)

### Syntax Highlighting

Code blocks support syntax highlighting:

````markdown
\`\`\`ruby
def hello
  puts "Hello World"
end
\`\`\`

\`\`\`javascript
function greet() {
  console.log('Hello World')
}
\`\`\`
````

### Auto-linking Headings

All headings automatically get:
- Unique IDs (via `rehype-slug`)
- Anchor links (via `rehype-autolink-headings`)

```markdown
## My Section    # → <h2 id="my-section">My Section</h2>
```

## Backend Services

### BlogPost Service

**File**: `app/services/blog_post.rb`

**Purpose**: Parse and manage blog posts from `.mdx` files

**Key Methods**:
```ruby
BlogPost.all              # All posts (cached 1 hour)
BlogPost.published        # Only published posts
BlogPost.find_by_slug(slug)
BlogPost.find_by_path(year, slug)
BlogPost.by_category(category)
BlogPost.by_tag(tag)
BlogPost.categories       # All unique categories
BlogPost.all_tags         # All unique tags
BlogPost.reload!          # Clear cache and reload
```

**Caching**: Posts cached for 1 hour with race condition protection

### BlogSearchIndex Service

**File**: `app/services/blog_search_index.rb`

**Purpose**: Build searchable index for client-side search

**Returns**: Array of post metadata for FlexSearch indexing

### BlogPostWriter Service

**File**: `app/services/blog_post_writer.rb`

**Purpose**: Securely write/update/delete `.mdx` files

**Security**:
- Strict slug validation: `/\A[a-z0-9\-_]+\z/`
- Prevents directory traversal
- Validates file paths

**Methods**:
```ruby
BlogPostWriter.create(params)     # Create new post
BlogPostWriter.update(slug, params) # Update existing post
BlogPostWriter.delete(slug)       # Delete post
```

## Frontend Components

### MDXRenderer

**File**: `app/frontend/components/blog/MDXRenderer.tsx`

**Purpose**: Runtime MDX compilation and rendering

**Features**:
- Async MDX compilation with `@mdx-js/mdx`
- Configured remark/rehype plugins
- Error handling
- Loading states
- Tailwind Typography styling

**Usage**:
```tsx
import MDXRenderer from '@/components/blog/MDXRenderer'

<MDXRenderer content={post.content} />
```

### Blog Pages

**Index Page** (`blog/Index.tsx`):
- Post grid layout
- FlexSearch integration
- Category filters
- Tag filters
- Responsive design

**Show Page** (`blog/Show.tsx`):
- Single post display
- MDX content rendering
- Related posts section
- Back navigation

**Category Page** (`blog/Category.tsx`):
- Filtered post listing
- Category/tag switching
- Reusable for both categories and tags

**Admin Pages**:
- `admin/Index.tsx`: Post management dashboard
- `admin/New.tsx`: Create post form with auto-slug
- `admin/Edit.tsx`: Edit post form with warnings

## Performance

### Caching Strategy

**Rails Cache** (1 hour expiry):
- Blog post index
- Search index
- Individual post data

**Race Condition Protection**: 5-second TTL prevents cache stampede

**Cache Invalidation**:
```ruby
BlogPost.reload!  # Clear all blog caches
```

### File Watcher (Development Only)

**File**: `config/initializers/blog_file_watcher.rb`

**Purpose**: Auto-reload posts when `.mdx` files change

**Requires**: `listen` gem (optional)

**Usage**:
```ruby
# Add to Gemfile
gem 'listen'
```

Automatically watches `app/content/posts/` for changes and reloads cache.

### Bundle Optimization

**Lazy Loading**: MDXRenderer lazy-loaded to reduce initial bundle

**Code Splitting**: Admin pages only loaded when needed

**Search**: Client-side FlexSearch (no server round-trips)

## Security Considerations

### Slug Validation

Only allows: `[a-z0-9\-_]+`

Prevents directory traversal attacks like:
- `../../../etc/passwd`
- `..%2F..%2Fetc%2Fpasswd`

### Authentication

**Public Routes**: No authentication required
- `/blog`
- `/blog/:year/:slug`
- `/blog/category/:category`
- `/blog/tag/:tag`

**Admin Routes**: Devise authentication required
- `/blog/admin/*`

### Authorization

Currently: Any authenticated user can manage posts

**To restrict to admin users**, update `blog_admin_controller.rb`:

```ruby
before_action :authorize_admin

private

def authorize_admin
  redirect_to root_path unless current_user&.admin?
end
```

### CSRF Protection

Enabled by default via `ApplicationController`

All admin forms include CSRF tokens automatically via Inertia.js

## Vietnamese Slug Generator

### Overview

The blog module includes a comprehensive Vietnamese slug generator that converts Vietnamese text with diacritics to URL-friendly slugs.

**File**: `app/frontend/lib/slugify.ts`

### Features

- ✅ Full Vietnamese diacritic mapping (à, á, ạ, ả, ã, â, ầ, ấ, ậ, ẩ, ẫ, ă, ằ, ắ, ặ, ẳ, ẵ → a)
- ✅ Special character handling (đ → d, Đ → D)
- ✅ URL-safe output (only lowercase letters, numbers, and dashes)
- ✅ Automatic hyphenation (spaces → dashes)
- ✅ Duplicate dash removal
- ✅ Trimming of leading/trailing dashes

### Usage

```typescript
import { slugify } from '@/lib/slugify'

// Vietnamese text
slugify('Xin chào Việt Nam')
// Output: 'xin-chao-viet-nam'

slugify('Học lập trình React và Rails')
// Output: 'hoc-lap-trinh-react-va-rails'

slugify('Hướng dẫn sử dụng MDX')
// Output: 'huong-dan-su-dung-mdx'

// Mixed Vietnamese and English
slugify('Tutorial: Tạo Blog với Rails')
// Output: 'tutorial-tao-blog-voi-rails'

// Special characters
slugify('Hello@World! #2024')
// Output: 'helloworld-2024'

// Edge cases
slugify('   Multiple   Spaces   ')
// Output: 'multiple-spaces'
```

### Auto-slug in Admin Forms

The admin "New Post" form automatically generates slugs from the post title using the slugify function:

```typescript
const handleTitleChange = (value: string) => {
  setData('title', value)
  // Auto-generate slug if it's empty or matches the previous auto-generated slug
  if (!data.slug || data.slug === slugify(data.title)) {
    setData('slug', slugify(value))
  }
}
```

**Behavior**:
- Typing in the Title field automatically updates the Slug field
- Once you manually edit the slug, auto-generation stops
- Vietnamese characters are converted to their ASCII equivalents
- Spaces become dashes, special characters are removed

### Character Mapping

The slugify function includes comprehensive Vietnamese character mapping:

```typescript
const vietnameseMap: Record<string, string> = {
  // a variations
  'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',

  // e variations
  'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',

  // i variations
  'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',

  // o variations
  'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',

  // u variations
  'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',

  // y variations
  'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',

  // d special case
  'đ': 'd', 'Đ': 'D',
}
```

### Customization

To modify slug generation behavior, edit `app/frontend/lib/slugify.ts`:

```typescript
export function slugify(text: string): string {
  // Add custom character mappings
  const customMap = {
    '&': 'and',
    '@': 'at',
    // ... more custom mappings
  }

  // Combine with Vietnamese map
  const fullMap = { ...vietnameseMap, ...customMap }

  // Apply transformations
  return text
    .split('').map(char => fullMap[char] || char).join('')
    .toLowerCase()
    .replace(/[^a-z0-9\-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
}
```

## Customization

### Styling

**Typography**: Edit prose classes in `MDXRenderer.tsx`:

```tsx
<article className="prose prose-lg max-w-none dark:prose-invert">
```

**Custom Styles**: Add to `application.css`:

```css
@layer components {
  .prose {
    @apply text-foreground;
  }

  .prose table {
    @apply border-border;
  }
}
```

### MDX Plugins

Add more remark/rehype plugins in `MDXRenderer.tsx`:

```typescript
const code = String(await compile(content, {
  outputFormat: 'function-body',
  remarkPlugins: [
    remarkGfm,
    remarkMath,           // Add math support
    remarkEmoji,          // Add emoji support
  ],
  rehypePlugins: [
    rehypeSlug,
    rehypeAutolinkHeadings,
    rehypeHighlight,      // Alternative syntax highlighting
  ],
}))
```

### Post Template

Create a default template in `admin/New.tsx`:

```typescript
const { data, setData, post } = useForm({
  title: '',
  slug: '',
  date: new Date().toISOString().split('T')[0],
  excerpt: '',
  category: 'Tutorial',        // Default category
  tags: ['rails', 'react'],    // Default tags
  author: current_user?.name,  // Auto-fill author
  published: false,            // Start as draft
  content: '# New Post\n\nStart writing here...'
})
```

## Troubleshooting

This section documents all the errors encountered during implementation and their solutions.

### Error 1: BlogPost Constant Not Found

**Problem**: `NameError: uninitialized constant BlogController::BlogPost`

**Cause**: Rails wasn't autoloading the `app/services` directory

**Solution**: Added to `config/application.rb`:

```ruby
config.autoload_paths << Rails.root.join("app/services")
config.eager_load_paths << Rails.root.join("app/services")
```

**Action Required**: Restart Rails server after making this change

---

### Error 2: Admin Routes Not Working

**Problem**: Accessing `/blog/admin/new` returns 404 or shows blog post not found

**Cause**: Routes were ordered incorrectly - wildcard route `blog/:year/:slug` was catching admin routes

**Solution**: Reordered routes in `config/routes.rb` - admin routes must come **before** wildcard public routes:

```ruby
# CORRECT ORDER:

# Blog admin routes (authenticated) - must come before wildcard routes
get "blog/admin", to: "blog_admin#index", as: :blog_admin_index
get "blog/admin/new", to: "blog_admin#new", as: :new_blog_admin
# ... more admin routes

# Blog routes (public) - wildcard routes come last
get "blog", to: "blog#index", as: :blog_index
get "blog/:year/:slug", to: "blog#show", as: :blog_post
```

**Why**: Rails matches routes in the order they're defined. Wildcard routes must be last.

---

### Error 3: Parameter Missing

**Problem**: `ActionController::ParameterMissing: param is missing or the value is empty: post`

**Cause**: Expected nested params like `params[:post][:title]`, but Inertia.js sends flat data structure

**Original Code**:
```ruby
def post_params
  params.require(:post).permit(:title, :slug, ...)
end
```

**Solution**: Changed to accept flat parameter structure:

```ruby
def post_params
  # Inertia sends data at root level, not nested under :post
  params.permit(
    :title, :slug, :date, :excerpt, :category, :author,
    :published, :featured_image, :content, tags: []
  )
end
```

**Why**: Inertia.js form data is sent at the root level of params, not nested under a model key.

---

### Error 4: FlexSearch Import Error

**Problem**: TypeScript/runtime errors with FlexSearch import

**Original Code**:
```typescript
import FlexSearch from 'flexsearch'
const index = new FlexSearch(...)
```

**Solution**: Changed to named import:

```typescript
import { Document } from 'flexsearch'

const searchIndex = useMemo(() => {
  const index = new Document({
    document: {
      id: 'id',
      index: ['title', 'excerpt', 'content'],
      store: ['title', 'url_path']
    }
  })
  search_index.forEach(doc => index.add(doc))
  return index
}, [search_index])
```

**Why**: FlexSearch exports named exports, not a default export.

---

### Error 5: TypeScript Unused Variable Errors

**Problem**: Multiple TypeScript errors for unused variables

**Examples**:
- `'tags' is declared but its value is never read`
- `'components' is declared but its value is never read`
- `'generateSlug' is declared but its value is never read`

**Solution**: Removed all unused imports and variables from the code

**Prevention**: Run `npm run check` before committing to catch TypeScript errors

---

### Error 6: MDX Tables Not Rendering

**Problem**: Markdown tables show as plain text instead of formatted HTML tables

**Example**:
```markdown
| Feature | Status |
|---------|--------|
| Tables  | Working |
```
Shows as text instead of a table.

**Cause**: `remark-gfm` plugin was configured in `vite.config.ts` but not in the runtime MDX compilation in `MDXRenderer.tsx`

**Solution**: Added `remarkPlugins` to the runtime compile options:

```typescript
import remarkGfm from 'remark-gfm'

const code = String(await compile(content, {
  outputFormat: 'function-body',
  development: false,
  remarkPlugins: [remarkGfm],  // ← Added this
  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
}))
```

**Why**: Build-time and runtime MDX compilation need the same plugins configured.

---

### Error 7: Cannot Type Comma in Tags Field

**Problem**: When typing in the tags input field, commas disappear immediately

**Cause**: The `onChange` handler was splitting and parsing the string on every keystroke:

```typescript
// BAD - splits on every keystroke
onChange={e => setData('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
```

**Solution**: Used separate state for the input string, only parse on form submission:

```typescript
// Separate state for input
const [tagsInput, setTagsInput] = useState('')

// Just update string on change
<Input
  id="tags"
  value={tagsInput}
  onChange={e => setTagsInput(e.target.value)}  // ← No parsing here
  placeholder="rails, react, tutorial (comma-separated)"
/>

// Parse only on submit
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  const parsedTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
  setData('tags', parsedTags)

  post('/blog/admin', {
    onBefore: () => {
      setData('tags', parsedTags)
    }
  })
}
```

**Why**: Parsing on every keystroke was removing commas before the user could type the next character.

---

### Error 8: Unused Package (gray-matter)

**Problem**: `gray-matter` package was installed but never used

**Cause**: Initial plan included client-side frontmatter parsing, but this wasn't needed

**Solution**: Removed the package:

```bash
npm uninstall gray-matter
```

**Why**:
- Ruby side uses `YAML.safe_load` for frontmatter parsing
- React components receive already-parsed data from Rails
- No client-side parsing is needed

---

### Common Issues

#### Posts Not Found

**Problem**: "Post not found" error when accessing a blog post

**Solutions**:
1. Check file path matches pattern: `app/content/posts/{year}/{slug}.mdx`
2. Verify frontmatter includes `published: true`
3. Check Rails logs for debug output
4. Clear cache: `BlogPost.reload!` in Rails console
5. Ensure file has proper YAML frontmatter with `---` delimiters

#### MDX Compilation Errors

**Problem**: Error rendering MDX content

**Solutions**:
1. Check browser console for specific error
2. Validate MDX syntax (especially code blocks need triple backticks)
3. Ensure frontmatter is valid YAML
4. Check for unescaped characters in content
5. Verify code blocks use proper language identifiers

#### Search Not Working

**Problem**: Search returns no results

**Solutions**:
1. Check `search_index` is being passed to component as a prop
2. Verify FlexSearch is installed: `npm list flexsearch`
3. Check browser console for FlexSearch errors
4. Ensure `Document` is imported from flexsearch (not default import)
5. Verify search index is being built in the controller

#### Admin Authentication Issues

**Problem**: Admin pages redirect to login

**Solutions**:
1. Ensure you're signed in via Devise
2. Check `current_user` is set
3. Verify `authenticate_user!` is called in `ApplicationController`
4. Check session is persisting (cookies enabled)

## Future Enhancements

### Potential Features

- RSS feed generation
- Comment system integration
- Social sharing buttons
- Reading time estimates
- Table of contents generation
- SEO meta tags
- Sitemap.xml generation
- Image optimization
- Draft preview URLs
- Scheduled publishing
- Post versioning
- Multi-author support
- Post series/collections
- Related posts algorithm
- Analytics integration

### Performance Improvements

- Static site generation option
- Image lazy loading
- Pagination for large post lists
- Incremental cache updates
- Build-time MDX compilation
- CDN integration

## Support

### Documentation Resources

- [MDX Documentation](https://mdxjs.com/)
- [Inertia.js Guide](https://inertiajs.com/)
- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)
- [FlexSearch Docs](https://github.com/nextapps-de/flexsearch)
- [remark-gfm](https://github.com/remarkjs/remark-gfm)

### Debug Mode

Enable debug logging in `blog_controller.rb`:

```ruby
def show
  Rails.logger.debug "=== Blog Post Lookup ==="
  Rails.logger.debug "Looking for: year=#{year}, slug=#{slug}"
  # ... more logging
end
```

### Rails Console

Useful commands:

```ruby
# List all posts
BlogPost.all.map(&:title)

# Find specific post
post = BlogPost.find_by_slug('my-post')

# Check post details
NotePostSerializer.one(post)

# Clear cache
BlogPost.reload!

# Test file writer
BlogPostWriter.create(title: "Test", slug: "test", ...)
```

## Credits

Built with:
- Ruby on Rails
- React + TypeScript
- Inertia.js
- MDX
- Tailwind CSS
- shadcn/ui
- FlexSearch

---

## Changelog

### Version 1.1.0 - December 19, 2024

**New Features**:
- ✅ Vietnamese slug generator with comprehensive diacritic mapping
- ✅ Blog navigation link in main header
- ✅ Auto-slug generation from post title in admin forms

**Bug Fixes**:
- ✅ Fixed tags input not allowing comma entry
- ✅ Fixed MDX tables not rendering (remark-gfm plugin)
- ✅ Fixed FlexSearch import errors
- ✅ Fixed admin routes being caught by wildcard routes
- ✅ Fixed Inertia.js parameter structure mismatch
- ✅ Fixed BlogPost constant not found (autoload paths)

**Documentation**:
- ✅ Added comprehensive troubleshooting section with 8 documented errors
- ✅ Added Vietnamese slug generator documentation
- ✅ Added header navigation documentation
- ✅ Documented all error fixes with causes and solutions

**Cleanup**:
- ✅ Removed unused gray-matter package
- ✅ Removed unused TypeScript variables

### Version 1.0.0 - December 18, 2024

**Initial Release**:
- File-based MDX blog system
- Blog post listing with search
- Category and tag filtering
- Admin UI for CRUD operations
- Public blog access
- Tailwind Typography styling
- FlexSearch integration
- Dark mode support

---

**Current Version**: 1.1.0
**Last Updated**: December 19, 2024
**Author**: Claude (Anthropic)
