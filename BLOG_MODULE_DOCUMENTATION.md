# Blog Module Documentation

## Overview

A complete MDX-powered blog system with file-based routing, built for Rails 8.1 + Inertia.js + React application. This module allows you to write blog posts in MDX format (Markdown + JSX) and manage them through both file system and a web-based admin interface.

## Features

### Core Features
- ✅ **File-based blog posts** - Posts stored as `.mdx` files in `app/content/posts/`
- ✅ **Directory-based routing** - `app/content/posts/2024/my-post.mdx` → `/blog/2024/my-post`
- ✅ **MDX support** - Write markdown with React components
- ✅ **Full-text search** - Client-side search using FlexSearch
- ✅ **Categories & tags** - Organize and filter posts
- ✅ **Admin UI** - Create, edit, and delete posts via web interface
- ✅ **Public blog** - No authentication required to read posts
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
├── frontend/components/blog/
│   └── MDXRenderer.tsx                       # MDX runtime compiler
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

- **Blog index**: `http://localhost:3000/blog`
- **Single post**: `http://localhost:3000/blog/2024/my-post-slug`
- **Category filter**: `http://localhost:3000/blog/category/Tutorial`
- **Tag filter**: `http://localhost:3000/blog/tag/rails`
- **Admin dashboard**: `http://localhost:3000/blog/admin` (requires authentication)

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

### Tables Not Rendering

**Problem**: Tables show as plain text

**Solution**: Ensure `remark-gfm` plugin is configured in `MDXRenderer.tsx`:

```typescript
remarkPlugins: [remarkGfm]
```

### Posts Not Found

**Problem**: "Post not found" error

**Solutions**:
1. Check file path matches pattern: `app/content/posts/{year}/{slug}.mdx`
2. Verify frontmatter includes `published: true`
3. Check Rails logs for debug output
4. Clear cache: `BlogPost.reload!` in Rails console

### Admin Routes Not Working

**Problem**: Admin pages return 404 or redirect

**Solutions**:
1. Ensure you're signed in (Devise authentication required)
2. Check routes order (admin routes must come before wildcard routes)
3. Restart Rails server after route changes

### MDX Compilation Errors

**Problem**: Error rendering MDX content

**Solutions**:
1. Check browser console for specific error
2. Validate MDX syntax (especially code blocks)
3. Ensure frontmatter is valid YAML
4. Check for unescaped characters in content

### Search Not Working

**Problem**: Search returns no results

**Solutions**:
1. Check `search_index` is being passed to component
2. Verify FlexSearch is installed: `npm list flexsearch`
3. Check browser console for FlexSearch errors
4. Ensure `Document` is imported from flexsearch

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
post.to_json_hash

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

**Version**: 1.0.0
**Last Updated**: December 2024
**Author**: Claude (Anthropic)
