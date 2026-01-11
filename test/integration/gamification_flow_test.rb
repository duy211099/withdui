require "test_helper"

class GamificationFlowTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "flow@example.com",
      password: "password123",
      name: "Flow Tester"
    )

    # Seed basic achievements
    @first_mood_achievement = Achievement.create!(
      key: "first_mood",
      name: "First Steps",
      category: "mood",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_moods_logged", threshold: 1 }
    )

    @week_streak_achievement = Achievement.create!(
      key: "week_streak",
      name: "Week Warrior",
      category: "mood",
      tier: "silver",
      unlock_criteria: { type: "streak", streak_type: "mood", days: 7 }
    )

    @early_bird_achievement = Achievement.create!(
      key: "early_bird",
      name: "Early Bird",
      category: "milestone",
      tier: "bronze",
      unlock_criteria: { type: "time_based", hour_before: 6 }
    )
  end

  test "complete mood logging flow awards points and unlocks achievements" do
    # Start with zero points
    assert_equal 0, @user.user_stat.total_points
    assert_equal 0, @user.user_achievements.count

    # Log first mood
    mood = @user.moods.create!(
      level: 4,
      entry_date: Date.current,
      notes: "Feeling good today!"
    )

    # Simulate what the controller does (in correct order!)
    # 1. First update stats counters
    @user.user_stat.increment!(:total_moods_logged)
    @user.update_mood_streak(mood.entry_date)

    # 2. Then award points (which triggers achievement check)
    @user.award_points(:mood_logged, source: mood)
    @user.award_points(:mood_with_notes, source: mood)

    # Verify points awarded (10 + 15 + achievement bonus)
    assert_operator @user.user_stat.reload.total_points, :>=, 25

    # Verify first mood achievement unlocked
    assert_operator @user.user_achievements.count, :>=, 1
    assert @user.user_achievements.exists?(achievement: @first_mood_achievement)

    # Verify mood counter updated
    assert_equal 1, @user.user_stat.total_moods_logged
  end

  test "logging moods for 7 consecutive days unlocks Week Warrior" do
    starting_date = Date.current - 6.days

    # Log moods for 7 consecutive days
    7.times do |i|
      mood_date = starting_date + i.days
      mood = @user.moods.create!(
        level: 4,
        entry_date: mood_date
      )

      @user.award_points(:mood_logged, source: mood)
      @user.update_mood_streak(mood.entry_date)
      @user.user_stat.increment!(:total_moods_logged)
    end

    # Should have 7-day streak
    assert_equal 7, @user.user_stat.reload.current_mood_streak

    # Should have unlocked both First Steps and Week Warrior
    assert_equal 2, @user.user_achievements.count
    assert @user.user_achievements.exists?(achievement: @week_streak_achievement)
  end

  test "missing a day resets streak" do
    # Log mood for 3 days
    3.times do |i|
      mood_date = Date.current - 6.days + i.days
      mood = @user.moods.create!(level: 3, entry_date: mood_date)
      @user.update_mood_streak(mood.entry_date)
    end

    assert_equal 3, @user.user_stat.reload.current_mood_streak

    # Skip a day and log again
    mood = @user.moods.create!(level: 3, entry_date: Date.current)
    @user.update_mood_streak(mood.entry_date)

    # Streak should reset to 1
    assert_equal 1, @user.user_stat.reload.current_mood_streak
  end

  test "logging mood in early morning unlocks Early Bird" do
    early_morning = Time.zone.local(2026, 1, 10, 5, 30, 0)

    mood = @user.moods.create!(level: 3, entry_date: Date.current)

    # Update stats FIRST, then award points
    @user.user_stat.increment!(:total_moods_logged)
    @user.award_points(:mood_logged, source: mood, metadata: { time: early_morning })

    # Should unlock both First Steps and Early Bird
    achievement_keys = @user.user_achievements.includes(:achievement).map { |ua| ua.achievement.key }
    assert_includes achievement_keys, "first_mood"
    assert_includes achievement_keys, "early_bird"
  end

  test "level up occurs when crossing threshold" do
    # Level 1 -> 2 threshold is 100 points
    # Give user 95 points
    @user.user_stat.update!(total_points: 95, current_level: 1)

    # Award 10 more points
    @user.award_points(:mood_logged)

    # Should level up to 2
    assert_equal 2, @user.user_stat.reload.current_level
    assert_equal 105, @user.user_stat.total_points

    # Verify GamificationEvent logged
    assert GamificationEvent.exists?(user: @user, event_type: "mood_logged")
  end

  test "multiple users maintain separate stats" do
    user2 = User.create!(
      email: "user2@example.com",
      password: "password123",
      name: "User 2"
    )

    # User 1 logs mood (update stats first)
    @user.user_stat.increment!(:total_moods_logged)
    @user.award_points(:mood_logged)

    # User 2 logs mood (update stats first)
    user2.user_stat.increment!(:total_moods_logged)
    user2.award_points(:mood_logged)

    # Each should have their own stats
    assert_operator @user.user_stat.reload.total_points, :>=, 10
    assert_operator user2.user_stat.reload.total_points, :>=, 10

    # Each should unlock achievements independently
    assert_operator @user.user_achievements.count, :>=, 1
    assert_operator user2.user_achievements.count, :>=, 1
  end

  test "gamification events maintain audit trail" do
    # Perform multiple actions
    @user.award_points(:mood_logged)
    @user.award_points(:mood_with_notes)
    @user.award_points(:great_mood_logged)

    # Should have 3 events plus achievement unlock
    events = GamificationEvent.where(user: @user).order(created_at: :asc)
    assert_operator events.count, :>=, 3

    # Verify event details
    mood_event = events.find_by(event_type: "mood_logged")
    assert_equal 10, mood_event.points_earned

    notes_event = events.find_by(event_type: "mood_with_notes")
    assert_equal 15, notes_event.points_earned
  end

  test "achievement points are added to total" do
    initial_points = @user.user_stat.total_points

    # Trigger bronze achievement (50 bonus points)
    @user.user_stat.update!(total_moods_logged: 1)
    @user.award_points(:mood_logged)

    # Total should include achievement bonus
    # mood_logged (10) + achievement bronze (50) = 60 points added
    assert_equal initial_points + 10 + 50, @user.user_stat.reload.total_points
  end

  test "dashboard data is complete and accurate" do
    # Create some activity
    3.times do |i|
      mood = @user.moods.create!(
        level: 5,
        entry_date: Date.current - (2 - i).days,
        notes: "Note #{i}"
      )
      @user.award_points(:mood_logged, source: mood)
      @user.award_points(:mood_with_notes, source: mood)
      @user.award_points(:great_mood_logged, source: mood)
      @user.update_mood_streak(mood.entry_date)
      @user.user_stat.increment!(:total_moods_logged)
      @user.user_stat.increment!(:total_great_moods)
    end

    stats = @user.user_stat.reload

    # Verify stats are accurate
    assert_equal 3, stats.total_moods_logged
    assert_equal 3, stats.total_great_moods
    assert_equal 3, stats.current_mood_streak
    assert_operator stats.total_points, :>, 0

    # Verify achievements exist
    assert_operator @user.user_achievements.count, :>, 0

    # Verify events logged
    assert_operator @user.gamification_events.count, :>, 0

    # Verify JSON serialization works
    json = UserStatsSerializer.one(stats).with_indifferent_access
    assert_kind_of Hash, json
    assert json.key?(:totalPoints) || json.key?(:total_points)
    assert json.key?(:currentLevel) || json.key?(:current_level)
    assert json.key?(:levelProgress) || json.key?(:level_progress)
  end
end
