/**
 * UI configuration types
 *
 * NOTE: Database model types are now auto-generated from serializers.
 * See: app/frontend/types/serializers/
 *
 * This file contains only UI-specific configuration types that are not
 * derived from database models (e.g., constants, UI state, etc.)
 */

/**
 * Single mood level configuration
 * Matches Mood::MOOD_LEVELS constant from app/models/mood.rb
 */
export interface MoodLevel {
  name: string
  emoji: string
  color: string
}

/**
 * Collection of mood levels indexed by level number (1-5)
 * Used for mood selection UI and display configuration
 */
export interface MoodLevels {
  [key: number]: MoodLevel
}

/**
 * Monthly mood summary statistics
 * Returned from Mood.month_summary class method
 */
export interface MonthlySummary {
  total_entries: number
  average_level: number | null
  level_counts: { [key: number]: number }
  best_day: string | null
  worst_day: string | null
}

/**
 * Life in Weeks types
 */

/**
 * Single life stage configuration (Erikson's psychosocial development)
 * Note: Keys are camelCase as Inertia.js auto-converts from Ruby snake_case
 */
export interface LifeStageConfig {
  name: string
  ageRange: { min: number; max: number }
  weekRange: { min: number; max: number }
  color: string
  description: string
}

/**
 * Collection of all life stages
 * Note: Keys are camelCase as Inertia.js auto-converts from Ruby snake_case
 */
export interface LifeStagesConfig {
  childhood: LifeStageConfig
  adolescence: LifeStageConfig
  youngAdult: LifeStageConfig
  middleAdult: LifeStageConfig
  lateAdult: LifeStageConfig
}

/**
 * Single week data in the 4,160-week grid
 * Note: Keys are camelCase as Inertia.js auto-converts from Ruby snake_case
 */
export interface WeekData {
  weekNumber: number
  year: number
  weekOfYear: number
  isLived: boolean
  lifeStage: keyof LifeStagesConfig
  stageColor: string
  hasNotes: boolean
  dateRange: {
    startDate: string
    endDate: string
    formatted: string
  }
}

/**
 * Aggregated mood data for a specific week
 * Note: Keys are camelCase as Inertia.js auto-converts from Ruby snake_case
 */
export interface WeekMoodData {
  count: number
  averageLevel: number
  moodEntries: Array<{
    level: number
    date: string
  }>
  sparklineData: number[]
}

/**
 * Statistics displayed in the dashboard cards
 * Note: Keys are camelCase as Inertia.js auto-converts from Ruby snake_case
 */
export interface LifeWeeksStatistics {
  weeksLived: number
  weeksRemaining: number
  lifePercentage: number
  ageInYears: number
  peakWeeksRemaining: number
  peakAgeRange: string
}

/**
 * Complete Life in Weeks data payload from backend
 * Note: Keys are camelCase as Inertia.js auto-converts from Ruby snake_case
 */
export interface LifeWeeksData {
  user: {
    birthDate: string
    ageInYears: number
    weeksLived: number
  }
  weeks: WeekData[]
  statistics: LifeWeeksStatistics
  lifeStages: LifeStagesConfig
  moodData: Record<number, WeekMoodData>
}

/**
 * Life week entry from database (user's custom notes/memories)
 * Note: Keys are camelCase as Inertia.js auto-converts from Ruby snake_case
 */
export interface LifeWeekEntry {
  id: string
  weekNumber: number
  notes: string | null
  memories: string | null
  dateRange: {
    startDate: string
    endDate: string
  }
  lifeStage: string
  yearAndWeek: {
    year: number
    weekOfYear: number
  }
  createdAt: string
  updatedAt: string
}
