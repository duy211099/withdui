# Gamification concern - adds game mechanics to models
# Handles points, levels, achievements, and streaks
module Gamifiable
  extend ActiveSupport::Concern

  included do
    # Gamification associations
    has_one :user_stat, dependent: :destroy
    has_many :user_achievements, dependent: :destroy
    has_many :achievements, through: :user_achievements
    has_many :gamification_events, dependent: :destroy
    has_many :daily_streaks, dependent: :destroy

    # Initialize gamification stats when user is created
    after_create :initialize_gamification_stats
  end

  # Instance methods available to the model
  # Access via: user.award_points(:mood_logged)
  def award_points(event_type, source: nil, metadata: {})
    GamificationService.new(self).award_points(event_type, source: source, metadata: metadata)
  end

  def update_mood_streak(entry_date)
    GamificationService.new(self).update_mood_streak(entry_date)
  end

  def update_writing_streak(post_date)
    GamificationService.new(self).update_writing_streak(post_date)
  end

  def current_level
    user_stat&.current_level || 1
  end

  def total_points
    user_stat&.total_points || 0
  end

  def has_achievement?(achievement_key)
    achievements.exists?(key: achievement_key)
  end

  private

  def initialize_gamification_stats
    create_user_stat!
  rescue ActiveRecord::RecordInvalid => e
    # Handle race condition if stats already exist
    Rails.logger.warn "Failed to create user_stat for user #{id}: #{e.message}"
  end
end
