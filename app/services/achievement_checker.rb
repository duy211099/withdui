# Service class for checking and unlocking achievements
# Evaluates unlock criteria and awards achievement points
class AchievementChecker
  attr_reader :user, :stats

  def initialize(user, user_stats)
    @user = user
    @stats = user_stats
  end

  # Check all achievements that might be triggered by this event
  # @param event_type [Symbol] The type of event that occurred
  # @param metadata [Hash] Additional context about the event
  def check_all(event_type, metadata = {})
    # Find achievements that might be triggered by this event category
    category = category_for_event(event_type)
    relevant_achievements = Achievement.where(category: category)

    relevant_achievements.each do |achievement|
      check_and_unlock(achievement, event_type, metadata)
    end

    # Also check milestone achievements (triggered by any event)
    Achievement.where(category: "milestone").each do |achievement|
      check_and_unlock(achievement, event_type, metadata)
    end
  end

  # Check all achievements regardless of category (useful for backfilling)
  def check_all_achievements
    Achievement.all.each do |achievement|
      check_and_unlock(achievement, nil, {})
    end
  end

  private

  # Check if achievement should be unlocked and do so if criteria met
  def check_and_unlock(achievement, event_type, metadata)
    # Skip if already unlocked
    return if @user.user_achievements.exists?(achievement: achievement)

    # Check if criteria is met
    if criteria_met?(achievement.unlock_criteria, event_type, metadata)
      unlock_achievement(achievement)
    end
  end

  # Evaluate unlock criteria
  # @param criteria [Hash] JSON criteria from achievement
  # @param event_type [Symbol] The triggering event type
  # @param metadata [Hash] Event metadata
  # @return [Boolean] Whether criteria is met
  def criteria_met?(criteria, event_type, metadata)
    return false unless criteria.present?

    case criteria["type"]
    when "count"
      # Check if a stat field meets a threshold
      # Example: { "type": "count", "field": "total_moods_logged", "threshold": 100 }
      field_value = @stats.send(criteria["field"])
      field_value >= criteria["threshold"]

    when "streak"
      # Check if a streak meets a threshold
      # Example: { "type": "streak", "streak_type": "mood", "days": 7 }
      streak_field = "current_#{criteria['streak_type']}_streak"
      current_streak = @stats.send(streak_field)
      current_streak >= criteria["days"]

    when "event"
      # Check if a specific event occurred
      # Example: { "type": "event", "event_type": "mood_logged" }
      event_type.to_s == criteria["event_type"]

    when "time_based"
      # Check if action happened at specific time
      # Example: { "type": "time_based", "hour_before": 6 } for Early Bird
      return false unless metadata[:time].present?

      hour = metadata[:time].hour
      if criteria["hour_before"]
        hour < criteria["hour_before"]
      elsif criteria["hour_after"]
        hour > criteria["hour_after"]
      else
        false
      end

    when "perfect_month"
      # Check if user logged mood every day for a full month
      # Example: { "type": "perfect_month" }
      check_perfect_month

    else
      false
    end
  end

  # Unlock an achievement and award points
  def unlock_achievement(achievement)
    # Create user achievement record
    user_achievement = UserAchievement.create!(
      user: @user,
      achievement: achievement,
      unlocked_at: Time.current
    )

    # Award achievement points based on tier
    tier_points = GAMIFICATION_CONFIG[:points]["achievement_unlocked_#{achievement.tier}".to_sym] || 0
    if tier_points > 0
      @stats.increment!(:total_points, tier_points)

      # Log the achievement unlock event
      GamificationEvent.create!(
        user: @user,
        event_type: "achievement_unlocked",
        points_earned: tier_points,
        metadata: {
          achievement_id: achievement.id,
          achievement_key: achievement.key,
          tier: achievement.tier
        }
      )
    end

    Rails.logger.info "User #{@user.id} unlocked achievement: #{achievement.name} (#{achievement.tier})"

    # Could trigger notification here
    # NotificationService.new(@user).achievement_unlocked(achievement)

    user_achievement
  rescue ActiveRecord::RecordNotUnique
    # Already unlocked in a parallel request - ignore
    Rails.logger.debug "Achievement #{achievement.key} already unlocked for user #{@user.id}"
    nil
  end

  # Determine achievement category from event type
  def category_for_event(event_type)
    case event_type.to_s
    when /mood/
      "mood"
    when /post|writing/
      "writing"
    when /event/
      "social"
    when /streak/
      "streak"
    else
      "milestone"
    end
  end

  # Check if user has logged mood every day for a full calendar month
  def check_perfect_month
    # Get the last mood entry date
    last_date = @stats.last_mood_entry_date
    return false unless last_date

    # Check if the last mood was at the end of a month
    return false unless last_date == last_date.end_of_month

    # Count moods in that month
    month_start = last_date.beginning_of_month
    month_end = last_date.end_of_month
    days_in_month = (month_end - month_start).to_i + 1

    moods_count = @user.moods.where(entry_date: month_start..month_end).count

    moods_count == days_in_month
  end
end
