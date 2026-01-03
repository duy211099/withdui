import type { Mood, Post } from './models'

/**
 * UI and configuration types
 */

/**
 * Single mood level configuration
 */
export interface MoodLevel {
  name: string
  emoji: string
  color: string
}

/**
 * Collection of mood levels indexed by level number (1-5)
 */
export interface MoodLevels {
  [key: number]: MoodLevel
}

/**
 * Monthly mood summary statistics
 */
export interface MonthlySummary {
  total_entries: number
  average_level: number | null
  level_counts: { [key: number]: number }
  best_day: string | null
  worst_day: string | null
}

/**
 * Utility types for different view contexts
 */

/** Mood detail for modal display (without updated_at) */
export type MoodDetail = Omit<Mood, 'updated_at'>

/** Post list item for blog index, category, and graph views */
export type PostListItem = Pick<
  Post,
  'title' | 'slug' | 'date' | 'excerpt' | 'category' | 'tags' | 'url_path' | 'featured_image'
>

/** Post detail for show page (without published flag) */
export type PostDetail = Omit<Post, 'published'>

/** Post list item for admin index */
export type PostAdminListItem = Pick<Post, 'title' | 'slug' | 'date' | 'published' | 'category'>
