# == Schema Information
#
# Table name: user_stats
#
#  id                       :uuid             not null, primary key
#  current_level            :integer          default(1), not null
#  current_mood_streak      :integer          default(0), not null
#  current_writing_streak   :integer          default(0), not null
#  last_mood_entry_date     :date
#  last_post_date           :date
#  longest_mood_streak      :integer          default(0), not null
#  longest_writing_streak   :integer          default(0), not null
#  points_to_next_level     :integer          default(100), not null
#  total_events_attended    :integer          default(0), not null
#  total_great_moods        :integer          default(0), not null
#  total_moods_logged       :integer          default(0), not null
#  total_notes_with_details :integer          default(0), not null
#  total_points             :integer          default(0), not null
#  total_posts_written      :integer          default(0), not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  user_id                  :uuid             not null
#
# Indexes
#
#  index_user_stats_on_user_id  (user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
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

  test "serializer should include all fields" do
    json = UserStatsSerializer.one(@user_stat).with_indifferent_access

    assert json.key?(:totalPoints) || json.key?(:total_points)
    assert json.key?(:currentLevel) || json.key?(:current_level)
    assert json.key?(:pointsToNextLevel) || json.key?(:points_to_next_level)
    assert json.key?(:levelProgress) || json.key?(:level_progress)
    assert json.key?(:currentMoodStreak) || json.key?(:current_mood_streak)
    assert json.key?(:totalMoodsLogged) || json.key?(:total_moods_logged)
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
