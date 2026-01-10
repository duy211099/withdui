# frozen_string_literal: true

# AchievementSerializer - Serializes achievement data for gamification views
class AchievementSerializer < BaseSerializer
  object_as :achievement, model: :Achievement

  attributes :id, :key, :name, :description, :category, :icon, :tier, :points_reward, :hidden
end
