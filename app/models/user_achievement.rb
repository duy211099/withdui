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
class UserAchievement < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :achievement

  # Validations
  validates :user_id, uniqueness: { scope: :achievement_id }
  validates :unlocked_at, presence: true

  # Scopes
  scope :recent, -> { order(unlocked_at: :desc) }
  scope :for_user, ->(user) { where(user: user) }
end
