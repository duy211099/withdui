# frozen_string_literal: true

# UserStatsSerializer - User gamification statistics
#
# Serializes user stats including points, levels, streaks, and activity counters.
# Includes computed field level_progress which is calculated percentage.
#
# == Schema Information
#
# Table name: user_stats
#
#  id                       :uuid             not null, primary key
#  current_level            :integer          default(1), not null
#  current_mood_streak      :integer          default(0), not null
#  current_writing_streak   :integer          default(0), not null
#  last_mood_entry_date     :date
#  last_post_date           :date
#  longest_mood_streak      :integer          default(0), not null
#  longest_writing_streak   :integer          default(0), not null
#  points_to_next_level     :integer          default(100), not null
#  total_events_attended    :integer          default(0), not null
#  total_great_moods        :integer          default(0), not null
#  total_moods_logged       :integer          default(0), not null
#  total_notes_with_details :integer          default(0), not null
#  total_points             :integer          default(0), not null
#  total_posts_written      :integer          default(0), not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  user_id                  :uuid             not null
#
class UserStatsSerializer < BaseSerializer
  object_as :user_stat, model: :UserStat

  attributes :total_points,
             :current_level,
             :points_to_next_level,
             :current_mood_streak,
             :longest_mood_streak,
             :current_writing_streak,
             :longest_writing_streak,
             :total_moods_logged,
             :total_posts_written,
             :total_events_attended,
             :total_great_moods,
             :total_notes_with_details

  # Computed field: percentage progress to next level (0-100)
  attribute :level_progress, type: :number do
    item.level_progress_percentage
  end
end
