/**
 * Core model types representing database entities
 */

/**
 * User model - represents authenticated users
 */
export interface User {
  id: number
  email: string
  name: string | null
  avatar_url?: string | null
}

/**
 * Mood model - represents a user's mood entry for a specific day
 * This is the COMPLETE type with all possible fields
 */
export interface Mood {
  id: number
  level: number
  entry_date: string
  notes: string | null
  mood_emoji: string
  mood_color: string
  mood_name: string
  user: User
  created_at: string
  updated_at: string
}

/**
 * Blog Post model - complete representation
 * This is the FULL type with all possible fields from the database
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

export interface Event {
  name: string
  price: number
  location: string
  description: string
}
