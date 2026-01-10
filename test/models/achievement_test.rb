# == Schema Information
#
# Table name: achievements
#
#  id              :uuid             not null, primary key
#  category        :string           not null
#  description     :text
#  display_order   :integer          default(0)
#  hidden          :boolean          default(FALSE)
#  icon            :string
#  key             :string           not null
#  name            :string           not null
#  points_reward   :integer          default(0)
#  tier            :string
#  unlock_criteria :jsonb
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_achievements_on_key  (key) UNIQUE
#
require "test_helper"

class AchievementTest < ActiveSupport::TestCase
  test "should have required fields" do
    achievement = Achievement.new(
      key: "test_achievement",
      name: "Test Achievement",
      category: "mood",
      tier: "bronze"
    )

    assert achievement.valid?
  end

  test "should require unique key" do
    Achievement.create!(
      key: "unique_key",
      name: "First",
      category: "mood",
      tier: "bronze"
    )

    duplicate = Achievement.new(
      key: "unique_key",
      name: "Second",
      category: "mood",
      tier: "silver"
    )

    assert_not duplicate.valid?
  end

  test "should have scopes for visibility" do
    hidden_achievement = Achievement.create!(
      key: "hidden_test",
      name: "Hidden Achievement",
      category: "milestone",
      tier: "platinum",
      hidden: true
    )

    visible_achievement = Achievement.create!(
      key: "visible_test",
      name: "Visible Achievement",
      category: "mood",
      tier: "bronze",
      hidden: false
    )

    assert_includes Achievement.visible, visible_achievement
    assert_not_includes Achievement.visible, hidden_achievement
  end

  test "should order by display_order" do
    a1 = Achievement.create!(key: "a1", name: "A1", category: "mood", tier: "bronze", display_order: 2)
    a2 = Achievement.create!(key: "a2", name: "A2", category: "mood", tier: "bronze", display_order: 1)
    a3 = Achievement.create!(key: "a3", name: "A3", category: "mood", tier: "bronze", display_order: 3)

    ordered = Achievement.ordered.pluck(:key)
    assert_equal [ "a2", "a1", "a3" ], ordered
  end

  test "should store unlock criteria as JSON" do
    achievement = Achievement.create!(
      key: "streak_test",
      name: "Streak Test",
      category: "mood",
      tier: "silver",
      unlock_criteria: { type: "streak", days: 7 }
    )

    assert_equal "streak", achievement.unlock_criteria["type"]
    assert_equal 7, achievement.unlock_criteria["days"]
  end

  test "to_json_hash should include all fields" do
    achievement = Achievement.create!(
      key: "test",
      name: "Test Achievement",
      description: "Test description",
      category: "mood",
      tier: "gold",
      points_reward: 200
    )

    json = achievement.to_json_hash

    assert_equal "test", json[:key]
    assert_equal "Test Achievement", json[:name]
    assert_equal "gold", json[:tier]
    assert_equal 200, json[:points_reward]
  end
end
