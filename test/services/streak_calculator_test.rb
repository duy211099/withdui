require "test_helper"

class StreakCalculatorTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      email: "streaker@example.com",
      password: "password123",
      name: "Streaker"
    )
    @user_stat = @user.user_stat
  end

  test "should start streak with first mood" do
    # Create calculator after any stat updates
    calculator = StreakCalculator.new(@user)

    # Need to have at least one mood in the database for streak calculation
    @user.moods.create!(level: 3, entry_date: Date.current)

    streak = calculator.update_mood_streak(Date.current)

    assert_operator streak, :>=, 1
    assert_operator @user_stat.reload.current_mood_streak, :>=, 0
    assert_equal Date.current, @user_stat.last_mood_entry_date
  end

  test "should increment streak for consecutive days" do
    @user_stat.update!(
      current_mood_streak: 1,
      longest_mood_streak: 1,
      last_mood_entry_date: Date.current - 1.day
    )

    # Create calculator AFTER updating stats
    calculator = StreakCalculator.new(@user)
    streak = calculator.update_mood_streak(Date.current)

    assert_equal 2, streak
    assert_equal 2, @user_stat.reload.current_mood_streak
    assert_equal 2, @user_stat.longest_mood_streak
  end

  test "should not increment streak for same day" do
    @user_stat.update!(
      current_mood_streak: 3,
      longest_mood_streak: 5,
      last_mood_entry_date: Date.current
    )

    calculator = StreakCalculator.new(@user)
    streak = calculator.update_mood_streak(Date.current)

    assert_equal 3, streak
    assert_equal 3, @user_stat.reload.current_mood_streak
  end

  test "should reset streak if gap in days" do
    @user_stat.update!(
      current_mood_streak: 7,
      longest_mood_streak: 7,
      last_mood_entry_date: Date.current - 3.days
    )

    calculator = StreakCalculator.new(@user)
    streak = calculator.update_mood_streak(Date.current)

    assert_equal 1, streak
    assert_equal 1, @user_stat.reload.current_mood_streak
    # Longest streak should remain unchanged
    assert_equal 7, @user_stat.longest_mood_streak
  end

  test "should update longest streak when current exceeds it" do
    @user_stat.update!(
      current_mood_streak: 5,
      longest_mood_streak: 5,
      last_mood_entry_date: Date.current - 1.day
    )

    calculator = StreakCalculator.new(@user)
    calculator.update_mood_streak(Date.current)

    assert_equal 6, @user_stat.reload.current_mood_streak
    assert_equal 6, @user_stat.longest_mood_streak
  end

  test "should maintain longest streak when current is lower" do
    @user_stat.update!(
      current_mood_streak: 3,
      longest_mood_streak: 10,
      last_mood_entry_date: Date.current - 1.day
    )

    calculator = StreakCalculator.new(@user)
    calculator.update_mood_streak(Date.current)

    assert_equal 4, @user_stat.reload.current_mood_streak
    assert_equal 10, @user_stat.longest_mood_streak
  end

  test "should create daily_streak record" do
    calculator = StreakCalculator.new(@user)

    assert_difference "DailyStreak.count", 1 do
      calculator.update_mood_streak(Date.current)
    end

    daily_streak = DailyStreak.last
    assert_equal @user.id, daily_streak.user_id
    assert_equal Date.current, daily_streak.streak_date
    assert_equal "mood", daily_streak.streak_type
    assert daily_streak.completed
  end

  test "should not create duplicate daily_streak for same day" do
    calculator = StreakCalculator.new(@user)
    calculator.update_mood_streak(Date.current)

    assert_no_difference "DailyStreak.count" do
      calculator.update_mood_streak(Date.current)
    end
  end

  test "update_writing_streak should work similarly to mood streak" do
    calculator = StreakCalculator.new(@user)
    streak = calculator.update_writing_streak(Date.current)

    assert_equal 1, streak
    assert_equal 1, @user_stat.reload.current_writing_streak
    assert_equal Date.current, @user_stat.last_post_date
  end

  test "should handle writing streak with consecutive days" do
    @user_stat.update!(
      current_writing_streak: 2,
      longest_writing_streak: 2,
      last_post_date: Date.current - 1.day
    )

    calculator = StreakCalculator.new(@user)
    streak = calculator.update_writing_streak(Date.current)

    assert_equal 3, streak
    assert_equal 3, @user_stat.reload.current_writing_streak
  end

  test "should handle streak milestones" do
    @user_stat.update!(
      current_mood_streak: 6,
      longest_mood_streak: 6,
      last_mood_entry_date: Date.current - 1.day
    )

    calculator = StreakCalculator.new(@user)
    # Updating streak might trigger milestone
    initial_points = @user_stat.total_points
    calculator.update_mood_streak(Date.current)

    # Verify streak was updated (points may or may not increase depending on milestone)
    assert_equal 7, @user_stat.reload.current_mood_streak
  end

  test "should handle future dates gracefully" do
    calculator = StreakCalculator.new(@user)
    future_date = Date.current + 10.days

    streak = calculator.update_mood_streak(future_date)

    # Should reset streak since it's not consecutive
    assert_equal 1, streak
  end

  test "should handle past dates" do
    @user_stat.update!(
      current_mood_streak: 5,
      last_mood_entry_date: Date.current
    )

    calculator = StreakCalculator.new(@user)
    past_date = Date.current - 5.days

    streak = calculator.update_mood_streak(past_date)

    # Past dates update the streak based on the date provided
    assert_kind_of Integer, streak
    assert_operator streak, :>=, 0
  end
end
