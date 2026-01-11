# == Schema Information
#
# Table name: gamification_events
#
#  id            :uuid             not null, primary key
#  event_type    :string           not null
#  metadata      :jsonb
#  points_earned :integer          default(0)
#  source_type   :string
#  created_at    :datetime         not null
#  source_id     :uuid
#  user_id       :uuid             not null
#
# Indexes
#
#  index_gamification_events_on_source_type_and_source_id  (source_type,source_id)
#  index_gamification_events_on_user_id_and_created_at     (user_id,created_at)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class GamificationEvent < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :source, polymorphic: true, optional: true

  # Validations
  validates :event_type, presence: true
  validates :points_earned, numericality: { greater_than_or_equal_to: 0 }

  # Scopes
  scope :recent, -> { order(created_at: :desc).limit(50) }
  scope :for_user, ->(user) { where(user: user) }
  scope :by_type, ->(event_type) { where(event_type: event_type) }
end
