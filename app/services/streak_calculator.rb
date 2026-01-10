# Service class for calculating and updating user streaks
# Handles both mood logging and writing streaks
class StreakCalculator
  attr_reader :user, :stats

  def initialize(user)
    @user = user
    @stats = user.user_stat
  end

  # Update mood streak based on entry date
  # @param entry_date [Date] The date of the mood entry
  # @return [Integer] Current mood streak
  def update_mood_streak(entry_date)
    return 0 unless @stats

    last_date = @stats.last_mood_entry_date

    if last_date.nil?
      # First entry
      start_new_streak("mood", entry_date)
    elsif entry_date == last_date + 1.day
      # Consecutive day - continue streak
      continue_streak("mood", entry_date)
    elsif entry_date == last_date
      # Same day (update) - no change to streak
      return @stats.current_mood_streak
    else
      # Streak broken - start new
      start_new_streak("mood", entry_date)
    end

    @stats.current_mood_streak
  end

  # Update writing streak based on post date
  # @param post_date [Date] The date of the post
  # @return [Integer] Current writing streak
  def update_writing_streak(post_date)
    return 0 unless @stats

    last_date = @stats.last_post_date

    if last_date.nil?
      # First post
      start_new_streak("writing", post_date)
    elsif post_date == last_date + 1.day
      # Consecutive day - continue streak
      continue_streak("writing", post_date)
    elsif post_date == last_date
      # Same day (update) - no change to streak
      return @stats.current_writing_streak
    else
      # Streak broken - start new
      start_new_streak("writing", post_date)
    end

    @stats.current_writing_streak
  end

  # Recalculate all streaks from scratch (useful for backfilling)
  def recalculate_all_streaks
    recalculate_mood_streak
    recalculate_writing_streak
  end

  private

  # Start a new streak
  def start_new_streak(type, date)
    case type
    when "mood"
      @stats.update!(
        current_mood_streak: 1,
        last_mood_entry_date: date
      )
      record_daily_streak("mood", date)
    when "writing"
      @stats.update!(
        current_writing_streak: 1,
        last_post_date: date
      )
      record_daily_streak("writing", date)
    end
  end

  # Continue an existing streak
  def continue_streak(type, date)
    case type
    when "mood"
      new_streak = @stats.current_mood_streak + 1
      @stats.update!(
        current_mood_streak: new_streak,
        longest_mood_streak: [ new_streak, @stats.longest_mood_streak ].max,
        last_mood_entry_date: date
      )
      record_daily_streak("mood", date)
      check_streak_milestones("mood", new_streak)
    when "writing"
      new_streak = @stats.current_writing_streak + 1
      @stats.update!(
        current_writing_streak: new_streak,
        longest_writing_streak: [ new_streak, @stats.longest_writing_streak ].max,
        last_post_date: date
      )
      record_daily_streak("writing", date)
      check_streak_milestones("writing", new_streak)
    end
  end

  # Record daily streak entry
  def record_daily_streak(type, date)
    DailyStreak.find_or_create_by!(
      user: @user,
      streak_type: type,
      streak_date: date
    )
  end

  # Check if current streak hits a milestone and award bonus points
  def check_streak_milestones(type, current_streak)
    milestones = GAMIFICATION_CONFIG[:streaks][type.to_sym][:milestone_days]

    if milestones.include?(current_streak)
      # Award bonus points for hitting milestone
      GamificationService.new(@user).award_points(
        "#{type}_streak_milestone".to_sym,
        metadata: { streak_days: current_streak, streak_type: type }
      )

      Rails.logger.info "User #{@user.id} hit #{current_streak}-day #{type} streak!"
    end
  end

  # Recalculate mood streak from database
  def recalculate_mood_streak
    moods = @user.moods.order(entry_date: :asc)
    return if moods.empty?

    current_streak = 1
    longest_streak = 1
    last_date = moods.first.entry_date

    moods.each_cons(2) do |prev_mood, curr_mood|
      if curr_mood.entry_date == prev_mood.entry_date + 1.day
        current_streak += 1
        longest_streak = [ current_streak, longest_streak ].max
      else
        current_streak = 1
      end
      last_date = curr_mood.entry_date
    end

    @stats.update!(
      current_mood_streak: current_streak,
      longest_mood_streak: longest_streak,
      last_mood_entry_date: last_date
    )
  end

  # Recalculate writing streak from database
  # Note: This assumes NotePost records are stored in DB
  # Adjust if your notes are file-based
  def recalculate_writing_streak
    # TODO: Implement when blog post tracking is added to database
    # For now, this is a placeholder
    Rails.logger.info "Writing streak recalculation not yet implemented"
  end
end
