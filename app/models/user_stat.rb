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
# Indexes
#
#  index_user_stats_on_user_id  (user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class UserStat < ApplicationRecord
  # Enable PaperTrail for audit logging
  has_paper_trail

  # Associations
  belongs_to :user

  # Validations
  validates :total_points, :current_level, numericality: { greater_than_or_equal_to: 0 }
  validates :current_mood_streak, :longest_mood_streak, numericality: { greater_than_or_equal_to: 0 }
  validates :current_writing_streak, :longest_writing_streak, numericality: { greater_than_or_equal_to: 0 }

  # Calculate progress to next level as percentage
  def level_progress_percentage
    return 100 if points_to_next_level.zero?

    current_level_threshold = GAMIFICATION_CONFIG[:levels][:thresholds][current_level - 1]
    next_level_threshold = GAMIFICATION_CONFIG[:levels][:thresholds][current_level]

    return 100 if next_level_threshold.nil?

    points_in_level = total_points - current_level_threshold
    points_needed = next_level_threshold - current_level_threshold

    percentage = ((points_in_level.to_f / points_needed) * 100).round(1)
    # Clamp percentage between 0 and 100 to handle data inconsistencies
    [ [ percentage, 0 ].max, 100 ].min
  end

  # Serialize to JSON for frontend
  def to_json_hash
    {
      total_points: total_points,
      current_level: current_level,
      points_to_next_level: points_to_next_level,
      level_progress: level_progress_percentage,
      current_mood_streak: current_mood_streak,
      longest_mood_streak: longest_mood_streak,
      current_writing_streak: current_writing_streak,
      longest_writing_streak: longest_writing_streak,
      total_moods_logged: total_moods_logged,
      total_posts_written: total_posts_written,
      total_events_attended: total_events_attended,
      total_great_moods: total_great_moods,
      total_notes_with_details: total_notes_with_details
    }
  end
end
