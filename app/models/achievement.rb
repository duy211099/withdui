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
class Achievement < ApplicationRecord
  # Associations
  has_many :user_achievements, dependent: :destroy
  has_many :users, through: :user_achievements

  # Validations
  validates :key, presence: true, uniqueness: true
  validates :name, :category, presence: true
  validates :tier, inclusion: { in: %w[bronze silver gold platinum], allow_nil: true }
  validates :category, inclusion: { in: %w[mood writing social milestone streak] }

  # Scopes
  scope :visible, -> { where(hidden: false) }
  scope :by_category, ->(category) { where(category: category) }
  scope :by_tier, ->(tier) { where(tier: tier) }
  scope :ordered, -> { order(display_order: :asc, created_at: :asc) }

  # Serialize to JSON for frontend
  def to_json_hash
    {
      id: id,
      key: key,
      name: name,
      description: description,
      category: category,
      icon: icon,
      tier: tier,
      points_reward: points_reward,
      hidden: hidden
    }
  end
end
