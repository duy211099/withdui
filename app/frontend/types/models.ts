/**
 * Post model types (markdown-based blog posts, not database models)
 *
 * NOTE: Most database model types are now auto-generated from serializers.
 * See: app/frontend/types/serializers/
 *
 * For database models like User, Mood, Event, etc., import from '@/types'
 * which re-exports the auto-generated serializer types.
 */

/**
 * Blog Post model - complete representation from markdown files
 * This is the FULL type with all possible fields
 */
export interface Post {
  title: string
  slug: string
  date: string
  excerpt: string
  category: string
  tags: string[]
  author: string | null
  published: boolean
  featuredImage?: string
  content: string
  urlPath: string
}

/**
 * Post list item for blog index, category, and graph views
 */
export type PostListItem = Pick<
  Post,
  'title' | 'slug' | 'date' | 'excerpt' | 'category' | 'tags' | 'urlPath' | 'featuredImage'
>

/**
 * Post detail for show page (without published flag)
 */
export type PostDetail = Omit<Post, 'published'>

/**
 * Post list item for admin index
 */
export type PostAdminListItem = Pick<Post, 'title' | 'slug' | 'date' | 'published' | 'category'>
