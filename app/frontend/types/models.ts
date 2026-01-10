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
  featured_image?: string
  content: string
  url_path: string
}

/**
 * Post list item for blog index, category, and graph views
 */
export type PostListItem = Pick<
  Post,
  'title' | 'slug' | 'date' | 'excerpt' | 'category' | 'tags' | 'url_path' | 'featured_image'
>

/**
 * Post detail for show page (without published flag)
 */
export type PostDetail = Omit<Post, 'published'>

/**
 * Post list item for admin index
 */
export type PostAdminListItem = Pick<Post, 'title' | 'slug' | 'date' | 'published' | 'category'>

/**
 * Gamification types (temporary - TODO: Create serializers for these)
 */

/**
 * Achievement - Badge/achievement definition
 */
export interface Achievement {
  id: string
  key: string
  name: string
  description: string
  category: string
  icon: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  points_reward: number
  hidden: boolean
}

/**
 * UserAchievement - User's unlocked achievement
 */
export interface UserAchievement {
  id: string
  achievement: Achievement
  unlocked_at: string
  progress: number
}

/**
 * GamificationEvent - Audit log of point-earning actions
 */
export interface GamificationEvent {
  id: string
  event_type: string
  points_earned: number
  created_at: string
  metadata?: Record<string, any>
}
