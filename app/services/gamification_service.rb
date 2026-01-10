# Service class for handling gamification logic
# Orchestrates point awards, level ups, and achievement checks
class GamificationService
  attr_reader :user, :stats

  def initialize(user)
    @user = user
    @stats = user.user_stat || create_initial_stats
  end

  # Main entry point for awarding points
  # @param event_type [Symbol] Type of event (e.g., :mood_logged, :post_created)
  # @param source [ActiveRecord::Base, nil] The object that triggered the event (optional)
  # @param metadata [Hash] Additional context for the event (optional)
  # @return [Integer] Points awarded
  def award_points(event_type, source: nil, metadata: {})
    points = calculate_points(event_type, metadata)
    return 0 if points.zero?

    ActiveRecord::Base.transaction do
      # Update user stats
      @stats.increment!(:total_points, points)

      # Log event for audit trail
      log_gamification_event(event_type, points, source, metadata)

      # Check for level up
      check_level_up

      # Check for new achievements
      check_achievements(event_type, metadata)
    end

    points
  end

  # Update mood streak and return current streak
  # @param mood_date [Date] The date of the mood entry
  # @return [Integer] Current mood streak
  def update_mood_streak(mood_date)
    StreakCalculator.new(@user).update_mood_streak(mood_date)
  end

  # Update writing streak and return current streak
  # @param post_date [Date] The date of the post
  # @return [Integer] Current writing streak
  def update_writing_streak(post_date)
    StreakCalculator.new(@user).update_writing_streak(post_date)
  end

  private

  # Calculate points for an event
  def calculate_points(event_type, metadata)
    base_points = GAMIFICATION_CONFIG[:points][event_type] || 0
    bonus_points = calculate_bonus_points(event_type, metadata)
    base_points + bonus_points
  end

  # Calculate bonus points based on metadata (streaks, etc.)
  def calculate_bonus_points(event_type, metadata)
    bonus = 0

    # Streak bonuses
    if metadata[:streak_days].present?
      streak_config = GAMIFICATION_CONFIG[:streaks][metadata[:streak_type]&.to_sym]
      bonus += (metadata[:streak_days] * streak_config[:points_per_day]) if streak_config
    end

    bonus
  end

  # Check if user leveled up and update stats
  def check_level_up
    new_level = calculate_level(@stats.total_points)
    old_level = @stats.current_level

    if new_level != old_level
      @stats.update!(
        current_level: new_level,
        points_to_next_level: calculate_points_to_next_level(new_level)
      )

      # Trigger level-up notification only for increases
      if new_level > old_level
        Rails.logger.info "User #{@user.id} leveled up to #{new_level}!"
      else
        # Log level correction for debugging
        Rails.logger.warn "User #{@user.id} level corrected from #{old_level} to #{new_level}"
      end
    end
  end

  # Check for newly unlocked achievements
  def check_achievements(event_type, metadata)
    AchievementChecker.new(@user, @stats).check_all(event_type, metadata)
  end

  # Calculate level from total points
  def calculate_level(total_points)
    level_from_points(total_points)
  end

  # Calculate points needed to reach next level
  def calculate_points_to_next_level(current_level)
    thresholds = GAMIFICATION_CONFIG[:levels][:thresholds]
    next_threshold = thresholds[current_level]

    return 0 unless next_threshold  # Max level reached

    next_threshold - @stats.total_points
  end

  # Log gamification event for audit trail
  def log_gamification_event(event_type, points, source, metadata)
    GamificationEvent.create!(
      user: @user,
      event_type: event_type.to_s,
      points_earned: points,
      source: source,
      metadata: metadata
    )
  end

  # Create initial user stats if they don't exist
  def create_initial_stats
    UserStat.create!(user: @user)
  end
end
