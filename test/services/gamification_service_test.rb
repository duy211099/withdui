require "test_helper"

class GamificationServiceTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      email: "gamer@example.com",
      password: "password123",
      name: "Gamer"
    )
    @service = GamificationService.new(@user)
    @user_stat = @user.user_stat
  end

  test "should award points for mood_logged event" do
    initial_points = @user_stat.total_points

    points_awarded = @service.award_points(:mood_logged)

    assert_equal 10, points_awarded
    assert_equal initial_points + 10, @user_stat.reload.total_points
  end

  test "should award points for mood_with_notes event" do
    points_awarded = @service.award_points(:mood_with_notes)

    assert_equal 15, points_awarded
  end

  test "should award points for post_created event" do
    points_awarded = @service.award_points(:post_created)

    assert_equal 50, points_awarded
  end

  test "should log gamification event" do
    assert_difference "GamificationEvent.count", 1 do
      @service.award_points(:mood_logged)
    end

    event = GamificationEvent.last
    assert_equal @user.id, event.user_id
    assert_equal "mood_logged", event.event_type
    assert_equal 10, event.points_earned
  end

  test "should check for level up when awarding points" do
    # Give user 95 points (5 away from level 2 at 100)
    @user_stat.update!(total_points: 95, current_level: 1)

    # Award 10 points to push over threshold
    @service.award_points(:mood_logged)

    assert_equal 2, @user_stat.reload.current_level
  end

  test "should update points_to_next_level on level up" do
    @user_stat.update!(total_points: 95, current_level: 1, points_to_next_level: 5)

    @service.award_points(:mood_logged)

    @user_stat.reload
    assert_equal 2, @user_stat.current_level
    # At level 2 (100 pts), next level is 3 (250 pts)
    # So points_to_next_level should be 250 - 105 = 145
    assert_equal 145, @user_stat.points_to_next_level
  end

  test "should not award points for unknown event type" do
    points_awarded = @service.award_points(:unknown_event)

    assert_equal 0, points_awarded
  end

  test "should trigger achievement check when awarding points" do
    # Create a simple achievement
    Achievement.create!(
      key: "first_points",
      name: "First Points",
      category: "milestone",
      tier: "bronze",
      unlock_criteria: { type: "count", field: "total_points", threshold: 10 }
    )

    assert_difference "@user.user_achievements.count", 1 do
      @service.award_points(:mood_logged)
    end
  end

  test "should handle source parameter" do
    mood = @user.moods.create!(level: 3, entry_date: Date.current)

    @service.award_points(:mood_logged, source: mood)

    event = GamificationEvent.last
    assert_equal mood.id, event.source_id
    assert_equal "Mood", event.source_type
  end

  test "should handle metadata parameter" do
    metadata = { test: true, value: 42 }

    @service.award_points(:mood_logged, metadata: metadata)

    event = GamificationEvent.last
    assert_equal true, event.metadata["test"]
    assert_equal 42, event.metadata["value"]
  end

  test "update_mood_streak should delegate to StreakCalculator" do
    mood_date = Date.current

    streak = @service.update_mood_streak(mood_date)

    assert_kind_of Integer, streak
    assert_operator streak, :>=, 0
  end

  test "update_writing_streak should delegate to StreakCalculator" do
    post_date = Date.current

    streak = @service.update_writing_streak(post_date)

    assert_kind_of Integer, streak
    assert_operator streak, :>=, 0
  end

  test "should work within transaction for consistency" do
    # This test verifies that gamification works within ActiveRecord transactions
    # If an outer transaction rolls back, gamification changes should roll back too

    ActiveRecord::Base.transaction do
      @service.award_points(:mood_logged)
      assert_equal 10, @user_stat.reload.total_points

      # Rollback the transaction
      raise ActiveRecord::Rollback
    end

    # Points should be rolled back
    assert_equal 0, @user_stat.reload.total_points
  end
end
