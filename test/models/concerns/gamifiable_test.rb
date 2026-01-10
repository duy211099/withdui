require "test_helper"

class GamifiableTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      email: "gamifiable@example.com",
      password: "password123",
      name: "Gamifiable User"
    )
  end

  test "user should have gamification associations" do
    assert_respond_to @user, :user_stat
    assert_respond_to @user, :user_achievements
    assert_respond_to @user, :achievements
    assert_respond_to @user, :gamification_events
    assert_respond_to @user, :daily_streaks
  end

  test "user_stat should be created automatically on user creation" do
    new_user = User.create!(
      email: "auto@example.com",
      password: "password123"
    )

    assert_not_nil new_user.user_stat
    assert new_user.user_stat.persisted?
  end

  test "user should have award_points method" do
    assert_respond_to @user, :award_points

    points = @user.award_points(:mood_logged)
    assert_equal 10, points
  end

  test "user should have update_mood_streak method" do
    assert_respond_to @user, :update_mood_streak

    streak = @user.update_mood_streak(Date.today)
    assert_kind_of Integer, streak
  end

  test "user should have update_writing_streak method" do
    assert_respond_to @user, :update_writing_streak

    streak = @user.update_writing_streak(Date.today)
    assert_kind_of Integer, streak
  end

  test "user should have current_level method" do
    assert_respond_to @user, :current_level
    assert_equal 1, @user.current_level
  end

  test "user should have total_points method" do
    assert_respond_to @user, :total_points
    assert_equal 0, @user.total_points
  end

  test "user should have has_achievement? method" do
    assert_respond_to @user, :has_achievement?

    achievement = Achievement.create!(
      key: "test_ach",
      name: "Test Achievement",
      category: "mood",
      tier: "bronze"
    )

    assert_not @user.has_achievement?("test_ach")

    @user.user_achievements.create!(achievement: achievement, unlocked_at: Time.current)

    assert @user.has_achievement?("test_ach")
  end

  test "current_level should return stat level or default to 1" do
    assert_equal 1, @user.current_level

    @user.user_stat.update!(current_level: 5)
    assert_equal 5, @user.current_level
  end

  test "total_points should return stat points or default to 0" do
    assert_equal 0, @user.total_points

    @user.user_stat.update!(total_points: 250)
    assert_equal 250, @user.total_points
  end

  test "destroying user should destroy associated gamification data" do
    # Create some gamification data
    @user.award_points(:mood_logged)
    @user.update_mood_streak(Date.today)

    achievement = Achievement.create!(
      key: "destroy_test",
      name: "Destroy Test",
      category: "mood",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_moods_logged", threshold: 1 }
    )
    @user.user_stat.update!(total_moods_logged: 1)
    AchievementChecker.new(@user, @user.user_stat).check_all(:mood_logged, {})

    user_id = @user.id

    # Verify data exists
    assert UserStat.exists?(user_id: user_id)
    assert GamificationEvent.exists?(user_id: user_id)
    assert DailyStreak.exists?(user_id: user_id)
    assert UserAchievement.exists?(user_id: user_id)

    # Destroy user
    @user.destroy

    # All associated data should be gone
    assert_not UserStat.exists?(user_id: user_id)
    assert_not GamificationEvent.exists?(user_id: user_id)
    assert_not DailyStreak.exists?(user_id: user_id)
    assert_not UserAchievement.exists?(user_id: user_id)
  end

  test "award_points should work through concern" do
    initial_points = @user.user_stat.total_points

    @user.award_points(:mood_logged)

    assert_equal initial_points + 10, @user.user_stat.reload.total_points
  end

  test "multiple award_points calls should accumulate" do
    @user.award_points(:mood_logged)           # 10 pts
    @user.award_points(:mood_with_notes)       # 15 pts
    @user.award_points(:great_mood_logged)     # 5 pts

    assert_equal 30, @user.user_stat.reload.total_points
  end

  test "user_stat is automatically created with defaults" do
    # This tests that user_stat is created on user creation

    user = User.create!(
      email: "autostat@example.com",
      password: "password123"
    )

    # Should have user_stat with default values
    assert_not_nil user.user_stat
    assert_equal 0, user.user_stat.total_points
    assert_equal 1, user.user_stat.current_level
    assert_equal 0, user.user_stat.current_mood_streak
  end

  test "concern methods should delegate to services correctly" do
    # award_points delegates to GamificationService
    result = @user.award_points(:mood_logged, source: nil, metadata: { test: true })
    assert_kind_of Integer, result

    # update_mood_streak delegates to StreakCalculator
    streak = @user.update_mood_streak(Date.today)
    assert_kind_of Integer, streak

    # Verify the delegation actually worked
    assert_operator @user.user_stat.reload.total_points, :>, 0
    assert_equal 1, @user.user_stat.current_mood_streak
  end
end
