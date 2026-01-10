# frozen_string_literal: true

# UserAchievementSerializer - Serializes a user's achievements with unlock info
class UserAchievementSerializer < BaseSerializer
  object_as :user_achievement, model: :UserAchievement

  attributes :id, :progress

  attribute :unlocked_at do
    item.unlocked_at.iso8601
  end

  attribute :achievement, serializer: AchievementSerializer
end
