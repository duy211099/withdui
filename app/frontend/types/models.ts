/**
 * Core model types representing database entities
 */

/**
 * User model - Complete database representation
 * Matches app/models/user.rb schema
 *
 * NOTE: Use serialized types (UserBasic, UserDetailed, UserMinimal) in your
 * component props instead of this complete type for better type safety.
 */
export interface User {
  id: string // UUIDv7
  email: string
  name: string | null
  avatar_url: string | null
  provider: string | null
  uid: string | null
  role: string
  created_at: string
  updated_at: string
}

/**
 * Serialized User types - Match app/serializers/user_serializer.rb
 * These types represent the actual data sent to the frontend.
 */

/**
 * UserBasic - Basic user info from UserSerializer#as_json
 * Use this for most common cases (profiles, comments, etc.)
 */
export interface UserBasic {
  id: string
  name: string | null
  email: string
  avatar_url: string | null
  role: string
  created_at: string
}

/**
 * UserDetailed - Extended info from UserSerializer#as_detailed_json
 * Use this for admin views or OAuth-related displays
 */
export interface UserDetailed extends UserBasic {
  provider: string | null
  uid: string | null
  updated_at: string
}

/**
 * UserMinimal - Lightweight info from UserSerializer#as_minimal_json
 * Use this for lists, dropdowns, or performance-critical components
 */
export interface UserMinimal {
  id: string
  name: string | null
  avatar_url: string | null
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
  id: string
  name: string
  price: number
  location: string
  description: string
}
