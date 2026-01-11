# frozen_string_literal: true

# UserAchievementSerializer - Serializes a user's achievements with unlock info
# == Schema Information
#
# Table name: user_achievements
#
#  id             :uuid             not null, primary key
#  progress       :integer          default(0)
#  unlocked_at    :datetime         not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  achievement_id :uuid             not null
#  user_id        :uuid             not null
#
# Indexes
#
#  index_user_achievements_on_unlocked_at                 (unlocked_at)
#  index_user_achievements_on_user_id_and_achievement_id  (user_id,achievement_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (achievement_id => achievements.id)
#  fk_rails_...  (user_id => users.id)
#
class UserAchievementSerializer < BaseSerializer
  object_as :user_achievement, model: :UserAchievement

  attributes :id, :progress

  attribute :unlocked_at do
    item.unlocked_at.iso8601
  end

  attribute :achievement, serializer: AchievementSerializer
end
