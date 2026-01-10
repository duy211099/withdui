# Serializers Documentation

This directory contains Oj::Serializer-based serializers that automatically generate TypeScript types.

## Overview

We use `oj_serializers` + `types_from_serializers` to:
1. **Fast JSON serialization** - Oj is optimized for performance
2. **Type safety** - Auto-generate TypeScript types from Ruby serializers
3. **Single source of truth** - Define API response structure once in Ruby
4. **DRY** - Reuse serialization logic across controllers

## Architecture

```
Backend (Ruby)                    Frontend (TypeScript)
──────────────                    ─────────────────────
BaseSerializer
├── UserSerializer         ──→    User (auto-generated)
├── RegistrationSerializer ──→    Registration (auto-generated)
└── ...                           └── with nested types
```

## Quick Start

### 1. Create a Serializer

```ruby
# app/serializers/post_serializer.rb
class PostSerializer < BaseSerializer
  object_as :post, model: :Post

  # Simple attributes
  attributes :id, :title, :content

  # Computed attribute
  attribute :published_at do
    item.published_at&.iso8601
  end

  # Nested serializer
  attribute :author, serializer: UserBasicSerializer
end
```

### 2. Use in Controller

```ruby
class PostsController < ApplicationController
  def index
    posts = Post.includes(:author).all
    render inertia: 'Posts/Index', props: {
      posts: PostSerializer.many(posts)
    }
  end

  def show
    post = Post.find(params[:id])
    render inertia: 'Posts/Show', props: {
      post: PostSerializer.one(post)
    }
  end
end
```

### 3. Use TypeScript Types

```typescript
// app/frontend/pages/Posts/Index.tsx
import type { Post } from '@/types/serializers'

interface IndexProps {
  posts: Post[]
}

export default function Index({ posts }: IndexProps) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          {post.title} by {post.author.name}
        </li>
      ))}
    </ul>
  )
}
```

### 4. Types Auto-Generated 🎉

After saving the serializer, types are generated automatically:

```typescript
// app/frontend/types/serializers/Post.ts (auto-generated)
export default interface Post {
  id: string
  title: string
  content?: string
  publishedAt: Date | null
  author: UserBasic
}
```

## Key Patterns

### Nested Types (Same Serializer)

Use `type:` parameter for inline nested objects:

```ruby
class RegistrationSerializer < BaseSerializer
  object_as :registration, model: :Registration

  # Nested event data with custom type
  attribute :event, type: :RegistrationEvent do
    {
      id: item.event.id,
      name: item.event.name,
      starts_at: item.event.starts_at&.iso8601
    }
  end
end
```

Then create the custom type manually:

```typescript
// app/frontend/types/RegistrationEvent.ts
export default interface RegistrationEvent {
  id: string
  name: string
  startsAt: string | null
}
```

### Nested Types (Different Serializer)

Use `serializer:` parameter to compose serializers:

```ruby
class CommentSerializer < BaseSerializer
  object_as :comment, model: :Comment

  attributes :id, :content

  # Use existing serializer
  attribute :author, serializer: UserBasicSerializer
  attribute :post, serializer: PostSerializer
end
```

Generated type:

```typescript
export default interface Comment {
  id: string
  content: string
  author: UserBasic  // References UserBasic type
  post: Post         // References Post type
}
```

### Conditional Attributes

Use `:if` for optional fields:

```ruby
class UserSerializer < BaseSerializer
  object_as :user, model: :User

  attributes :id, :name

  # Only include email if user is current user
  attribute :email, if: ->(user, options) { options[:current_user]&.id == user.id }
end
```

Generated type marks it as optional:

```typescript
export default interface User {
  id: string
  name: string
  email?: string  // Optional because of conditional
}
```

### Associations (has_one, has_many)

```ruby
class AlbumSerializer < BaseSerializer
  object_as :album, model: :Album

  attributes :id, :name

  # Serialize association
  has_one :artist, serializer: ArtistSerializer
  has_many :songs, serializer: SongSerializer
end
```

### Date/DateTime Handling

Always convert dates to ISO8601 strings:

```ruby
attribute :created_at do
  item.created_at.iso8601
end

attribute :starts_at do
  item.starts_at&.iso8601  # Use safe navigation for nullable dates
end
```

TypeScript types are configured to map these to `Date`:

```typescript
interface Registration {
  createdAt: Date      // Auto-mapped from datetime column
  startsAt: Date | null
}
```

## Configuration

Configuration is in `config/initializers/types_from_serializers.rb`:

```ruby
TypesFromSerializers.config do |config|
  config.base_serializers = ["BaseSerializer"]
  config.output_dir = Rails.root.join("app", "frontend", "types", "serializers")
  config.custom_types_dir = Rails.root.join("app", "frontend", "types")

  # snake_case → camelCase transformation
  config.transform_keys = ->(key) { key.to_s.camelize(:lower) }

  # Map SQL types to TypeScript
  config.sql_to_typescript_type_mapping.update(
    date: :Date,
    datetime: :Date,
    time: :Date
  )
end
```

## Best Practices

### 1. **Create Specific Serializers**

Don't use one serializer for everything. Create focused serializers:

```ruby
# Good ✅
UserBasicSerializer     # id, name, avatar (for lists)
UserDetailedSerializer  # All public fields (for profiles)
UserMinimalSerializer   # Just id, name (for nested refs)

# Bad ❌
UserSerializer with complex conditionals
```

### 2. **Use object_as for Clarity**

Always declare the object variable and model:

```ruby
# Good ✅
class PostSerializer < BaseSerializer
  object_as :post, model: :Post
  attributes :id, :title
end

# Avoid ❌
class PostSerializer < BaseSerializer
  attributes :id, :title  # What is 'object'?
end
```

### 3. **Sort Attributes Alphabetically**

Reduces git conflicts:

```ruby
# Good ✅
attributes :email, :id, :name

# Harder to maintain ❌
attributes :name, :id, :email
```

### 4. **Format Dates Consistently**

Always use ISO8601:

```ruby
# Good ✅
attribute :published_at do
  item.published_at&.iso8601
end

# Bad ❌ (loses timezone info)
attribute :published_at do
  item.published_at.to_s
end
```

### 5. **Document Complex Serializers**

```ruby
# RegistrationSerializer - Handles event registration data
#
# Used by:
# - RegistrationsController#index (list view)
# - RegistrationsController#show (detail view)
#
# Includes nested event data to avoid N+1 queries
class RegistrationSerializer < BaseSerializer
  # ...
end
```

## Generating Types

Types are auto-generated when:
- You save a serializer file (in development with Rails server running)
- You run: `bundle exec rake types_from_serializers:generate`
- Rails reloader triggers (on file change)

### Auto-Reload with Vite ⚡️

The project is configured with `vite-plugin-full-reload` for instant updates:

```typescript
// vite.config.ts
FullReload(['app/serializers/**/*.rb'], { delay: 200 })
```

**How it works:**
1. Save a serializer file (e.g., `app/serializers/post_serializer.rb`)
2. Rails reloader detects the change and regenerates TypeScript types
3. Vite detects the new `.ts` files and triggers a page reload
4. Your browser updates with the new types automatically!

**Delay explained:** The 200ms delay gives TypesFromSerializers enough time to generate the types before Vite reloads the page.

## Troubleshooting

### Types Not Updating

```bash
# Manually regenerate
bundle exec rake types_from_serializers:generate

# Check generated files
ls -l app/frontend/types/serializers/
```

### Import Errors in TypeScript

Check your `tsconfig.app.json` has the correct paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./app/frontend/*"]
    }
  }
}
```

### Naming Conflicts

If you have both model types and serializer types with the same name:

```typescript
// Use aliases when exporting
export type {
  User as UserSerialized,
  UserBasic as UserBasicSerialized
} from './serializers'
```

## Migration Guide

### From Manual JSON

**Before:**

```ruby
class PostsController < ApplicationController
  def index
    posts = Post.all
    render inertia: 'Posts/Index', props: {
      posts: posts.map { |p| { id: p.id, title: p.title } }
    }
  end
end
```

**After:**

```ruby
# Create serializer
class PostSerializer < BaseSerializer
  object_as :post, model: :Post
  attributes :id, :title
end

# Use in controller
class PostsController < ApplicationController
  def index
    posts = Post.all
    render inertia: 'Posts/Index', props: {
      posts: PostSerializer.many(posts)
    }
  end
end
```

## Resources

- [oj_serializers GitHub](https://github.com/ElMassimo/oj_serializers)
- [types_from_serializers GitHub](https://github.com/ElMassimo/types_from_serializers)
- [Oj gem documentation](https://github.com/ohler55/oj)
