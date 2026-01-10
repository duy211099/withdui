/**
 * Centralized type exports
 * Use this file for clean imports: import { User, Mood } from '@/types'
 *
 * IMPORTANT: Prefer auto-generated serializer types over manual model types.
 * The serializer types represent the actual data shape from API responses.

  * // bundle exec rake types_from_serializers:generate
 */

// Inertia types
export type { BasePageProps, InertiaPageProps } from './inertia'
// Post types (markdown-based, not from database)
// Gamification types (temporary - TODO: Create serializers)
export type {
  Achievement,
  GamificationEvent,
  Post,
  PostAdminListItem,
  PostDetail,
  PostListItem,
  UserAchievement,
} from './models'
// Auto-generated serializer types (actual API responses)
// These represent the actual data shape sent from backend to frontend
// ⭐ Use these types in your components for type-safety
export type {
  Event,
  Mood,
  Registration,
  RegistrationForm,
  User,
  UserBasic,
  UserDetailed,
  UserMinimal,
  UserStats,
} from './serializers'

// UI configuration types (not from database)
export type { MonthlySummary, MoodLevel, MoodLevels } from './ui'
