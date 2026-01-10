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
