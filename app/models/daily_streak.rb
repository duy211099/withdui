# == Schema Information
#
# Table name: daily_streaks
#
#  id          :uuid             not null, primary key
#  completed   :boolean          default(TRUE)
#  streak_date :date             not null
#  streak_type :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :uuid             not null
#
# Indexes
#
#  index_daily_streaks_unique  (user_id,streak_type,streak_date) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class DailyStreak < ApplicationRecord
  # Associations
  belongs_to :user

  # Validations
  validates :streak_date, presence: true
  validates :streak_type, presence: true, inclusion: { in: %w[mood writing] }
  validates :streak_date, uniqueness: { scope: [ :user_id, :streak_type ] }

  # Scopes
  scope :for_type, ->(type) { where(streak_type: type) }
  scope :in_range, ->(start_date, end_date) { where(streak_date: start_date..end_date) }
  scope :completed, -> { where(completed: true) }
end
