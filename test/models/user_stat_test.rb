require "test_helper"

class UserStatTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      email: "test@example.com",
      password: "password123",
      name: "Test User"
    )
    @user_stat = @user.user_stat
  end

  test "should be created automatically when user is created" do
    assert_not_nil @user_stat
    assert_equal @user.id, @user_stat.user_id
  end

  test "should have default values" do
    assert_equal 0, @user_stat.total_points
    assert_equal 1, @user_stat.current_level
    assert_equal 100, @user_stat.points_to_next_level
    assert_equal 0, @user_stat.current_mood_streak
    assert_equal 0, @user_stat.total_moods_logged
  end

  test "should calculate level progress percentage correctly" do
    # User with 150 points should be level 2 (100-250 range)
    @user_stat.update!(total_points: 150, current_level: 2)

    # 150 points in level 2 (100-250) = 50/150 = 33.3%
    assert_in_delta 33.3, @user_stat.level_progress_percentage, 0.1
  end

  test "level progress should be 100% at max level" do
    @user_stat.update!(
      total_points: 250000,
      current_level: 25,
      points_to_next_level: 0
    )

    assert_equal 100, @user_stat.level_progress_percentage
  end

  test "to_json_hash should include all fields" do
    json = @user_stat.to_json_hash

    assert json.key?(:total_points)
    assert json.key?(:current_level)
    assert json.key?(:points_to_next_level)
    assert json.key?(:level_progress)
    assert json.key?(:current_mood_streak)
    assert json.key?(:total_moods_logged)
  end

  test "should validate non-negative values" do
    @user_stat.total_points = -10
    assert_not @user_stat.valid?

    @user_stat.total_points = 0
    @user_stat.current_level = -1
    assert_not @user_stat.valid?
  end

  test "should belong to user" do
    assert_respond_to @user_stat, :user
    assert_equal @user, @user_stat.user
  end
end
