require "test_helper"

class AchievementCheckerTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      email: "achiever@example.com",
      password: "password123",
      name: "Achiever"
    )
    @user_stat = @user.user_stat
    @checker = AchievementChecker.new(@user, @user_stat)
  end

  test "should unlock count-based achievement when threshold met" do
    achievement = Achievement.create!(
      key: "10_moods",
      name: "10 Moods",
      category: "mood",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_moods_logged", threshold: 10 }
    )

    # Not yet unlocked
    @user_stat.update!(total_moods_logged: 5)
    @checker.check_all(:mood_logged, {})
    assert_not @user.user_achievements.exists?(achievement: achievement)

    # Should unlock when threshold reached
    @user_stat.update!(total_moods_logged: 10)
    @checker.check_all(:mood_logged, {})
    assert @user.user_achievements.exists?(achievement: achievement)
  end

  test "should unlock streak-based achievement" do
    achievement = Achievement.create!(
      key: "7_day_streak",
      name: "7 Day Streak",
      category: "mood",
      tier: "silver",
      unlock_criteria: { type: "streak", streak_type: "mood", days: 7 }
    )

    @user_stat.update!(current_mood_streak: 7)
    @checker.check_all(:mood_logged, {})

    assert @user.user_achievements.exists?(achievement: achievement)
  end

  test "should unlock event-based achievement" do
    achievement = Achievement.create!(
      key: "long_post",
      name: "Long Post",
      category: "writing",
      tier: "gold",
      unlock_criteria: { type: "event", event_type: "long_post_bonus" }
    )

    @checker.check_all(:long_post_bonus, {})

    assert @user.user_achievements.exists?(achievement: achievement)
  end

  test "should unlock time-based achievement for early morning" do
    achievement = Achievement.create!(
      key: "early_bird",
      name: "Early Bird",
      category: "milestone",
      tier: "bronze",
      unlock_criteria: { type: "time_based", hour_before: 6 }
    )

    # 5 AM should trigger
    early_time = Time.zone.local(2026, 1, 10, 5, 0, 0)
    @checker.check_all(:mood_logged, { time: early_time })

    assert @user.user_achievements.exists?(achievement: achievement)
  end

  test "should unlock time-based achievement for late night" do
    achievement = Achievement.create!(
      key: "night_owl",
      name: "Night Owl",
      category: "milestone",
      tier: "bronze",
      unlock_criteria: { type: "time_based", hour_after: 22 } # After 10 PM
    )

    # 11:30 PM (hour 23) should trigger (23 > 22)
    late_time = Time.zone.local(2026, 1, 10, 23, 30, 0)
    @checker.check_all(:mood_logged, { time: late_time })

    assert @user.user_achievements.exists?(achievement: achievement)
  end

  test "should not unlock time-based achievement without time metadata" do
    achievement = Achievement.create!(
      key: "early_bird_2",
      name: "Early Bird 2",
      category: "milestone",
      tier: "bronze",
      unlock_criteria: { type: "time_based", hour_before: 6 }
    )

    @checker.check_all(:mood_logged, {})

    assert_not @user.user_achievements.exists?(achievement: achievement)
  end

  test "should not unlock achievement if already unlocked" do
    achievement = Achievement.create!(
      key: "first_mood",
      name: "First Mood",
      category: "mood",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_moods_logged", threshold: 1 }
    )

    @user_stat.update!(total_moods_logged: 1)

    # First time
    assert_difference "@user.user_achievements.count", 1 do
      @checker.check_all(:mood_logged, {})
    end

    # Second time - should not create duplicate
    assert_no_difference "@user.user_achievements.count" do
      @checker.check_all(:mood_logged, {})
    end
  end

  test "should award tier-based bonus points on unlock" do
    bronze = Achievement.create!(
      key: "bronze_test",
      name: "Bronze",
      category: "mood",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_moods_logged", threshold: 1 }
    )

    @user_stat.update!(total_moods_logged: 1, total_points: 0)

    @checker.check_all(:mood_logged, {})

    # Bronze tier = 50 bonus points
    assert_equal 50, @user_stat.reload.total_points
  end

  test "should award different points for different tiers" do
    # Silver tier test
    @user_stat.update!(total_moods_logged: 10, total_points: 0)

    silver = Achievement.create!(
      key: "silver_test",
      name: "Silver",
      category: "mood",
      tier: "silver",
      unlock_criteria: { type: "count", field: "total_moods_logged", threshold: 10 }
    )

    @checker.check_all(:mood_logged, {})

    # Silver tier = 100 bonus points
    assert_equal 100, @user_stat.reload.total_points
  end

  test "should create gamification event on achievement unlock" do
    achievement = Achievement.create!(
      key: "event_test",
      name: "Event Test",
      category: "mood",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_moods_logged", threshold: 1 }
    )

    @user_stat.update!(total_moods_logged: 1)

    assert_difference "GamificationEvent.count", 1 do
      @checker.check_all(:mood_logged, {})
    end

    event = GamificationEvent.last
    assert_equal "achievement_unlocked", event.event_type
    assert_equal 50, event.points_earned
    assert_equal achievement.id, event.metadata["achievement_id"]
  end

  test "should check only relevant category achievements" do
    mood_achievement = Achievement.create!(
      key: "mood_test",
      name: "Mood Test",
      category: "mood",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_moods_logged", threshold: 1 }
    )

    writing_achievement = Achievement.create!(
      key: "writing_test",
      name: "Writing Test",
      category: "writing",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_posts_written", threshold: 1 }
    )

    @user_stat.update!(total_moods_logged: 1, total_posts_written: 0)

    # Checking mood event should unlock mood achievement, not writing
    @checker.check_all(:mood_logged, {})

    assert @user.user_achievements.exists?(achievement: mood_achievement)
    assert_not @user.user_achievements.exists?(achievement: writing_achievement)
  end

  test "should always check milestone category" do
    milestone = Achievement.create!(
      key: "milestone_test",
      name: "Milestone Test",
      category: "milestone",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_moods_logged", threshold: 1 }
    )

    @user_stat.update!(total_moods_logged: 1)

    # Milestone achievements should be checked regardless of event type
    @checker.check_all(:post_created, {})

    assert @user.user_achievements.exists?(achievement: milestone)
  end

  test "check_all_achievements should check every achievement" do
    Achievement.create!(
      key: "mood_ach",
      name: "Mood",
      category: "mood",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_moods_logged", threshold: 5 }
    )

    Achievement.create!(
      key: "writing_ach",
      name: "Writing",
      category: "writing",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_posts_written", threshold: 3 }
    )

    @user_stat.update!(total_moods_logged: 5, total_posts_written: 3)

    @checker.check_all_achievements

    # Both should be unlocked
    assert_equal 2, @user.user_achievements.count
  end

  test "should handle RecordNotUnique gracefully" do
    achievement = Achievement.create!(
      key: "duplicate_test",
      name: "Duplicate Test",
      category: "mood",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_moods_logged", threshold: 1 }
    )

    @user_stat.update!(total_moods_logged: 1)

    # Manually create the user_achievement
    @user.user_achievements.create!(achievement: achievement, unlocked_at: Time.current)

    # Trying to unlock again should not raise error
    assert_nothing_raised do
      @checker.check_all(:mood_logged, {})
    end
  end
end
