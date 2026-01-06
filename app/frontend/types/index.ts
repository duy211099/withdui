/**
 * Centralized type exports
 * Use this file for clean imports: import { User, Mood, Post } from '@/types'
 */

// Inertia types
export type { BasePageProps, InertiaPageProps } from './inertia'
// Model types
export type {
  Event,
  Mood,
  Post,
  User,
} from './models'

// UI types
export type {
  MonthlySummary,
  MoodDetail,
  MoodLevel,
  MoodLevels,
  PostAdminListItem,
  PostDetail,
  PostListItem,
} from './ui'
