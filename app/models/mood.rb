# == Schema Information
#
# Table name: moods
#
#  id         :uuid             not null, primary key
#  entry_date :date             not null
#  level      :integer          not null
#  notes      :text
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :uuid             not null
#
# Indexes
#
#  index_moods_on_entry_date              (entry_date)
#  index_moods_on_level                   (level)
#  index_moods_on_slug                    (slug) UNIQUE
#  index_moods_on_user_id_and_entry_date  (user_id,entry_date) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Mood < ApplicationRecord
  # Enable PaperTrail for audit logging
  has_paper_trail

  # Associations
  belongs_to :user

  # Validations
  validates :level, presence: true,
                    numericality: {
                      only_integer: true,
                      greater_than_or_equal_to: 1,
                      less_than_or_equal_to: 5
                    }
  validates :entry_date, presence: true,
                         uniqueness: { scope: :user_id,
                                      message: "already has a mood entry" }
  validates :notes, length: { maximum: 10_000 }
  validate :entry_date_not_in_future

  # Slug generation
  before_validation :generate_slug, on: :create

  def to_param
    slug
  end

  # Scopes for common queries
  scope :for_user, ->(user) { where(user: user) }
  scope :for_month, ->(year, month) {
    where(entry_date: Date.new(year, month, 1)..Date.new(year, month, -1))
  }
  scope :for_date_range, ->(start_date, end_date) {
    where(entry_date: start_date..end_date)
  }
  scope :by_level, ->(level) { where(level: level) }
  scope :recent_first, -> { order(entry_date: :desc) }
  scope :oldest_first, -> { order(entry_date: :asc) }

  # Class constant: mood level definitions
  MOOD_LEVELS = {
    1 => { name: "terrible", emoji: "😢", color: "#EF4444" },  # red-500
    2 => { name: "bad",      emoji: "😔", color: "#F97316" },  # orange-500
    3 => { name: "okay",     emoji: "😐", color: "#EAB308" },  # yellow-500
    4 => { name: "good",     emoji: "😊", color: "#84CC16" },  # lime-500
    5 => { name: "great",    emoji: "😄", color: "#22C55E" }   # green-500
  }.freeze

  def self.mood_config(level)
    MOOD_LEVELS[level]
  end

  # Instance methods
  def mood_name
    MOOD_LEVELS[level][:name]
  end

  def mood_emoji
    MOOD_LEVELS[level][:emoji]
  end

  def mood_color
    MOOD_LEVELS[level][:color]
  end

  # JSON serialization for Inertia
  def to_json_hash
    {
      id: id,
      level: level,
      entry_date: entry_date.to_s,
      notes: notes,
      mood_name: mood_name,
      mood_emoji: mood_emoji,
      mood_color: mood_color,
      created_at: created_at.iso8601,
      updated_at: updated_at.iso8601
    }
  end

  private

  def generate_slug
    return if slug.present?
    return unless entry_date.present?

    # Generate slug from entry date and a short random string for uniqueness
    base_slug = entry_date.to_s
    random_suffix = SecureRandom.hex(4)
    self.slug = "#{base_slug}-#{random_suffix}"
  end

  def entry_date_not_in_future
    return if entry_date.blank?

    if entry_date > Date.current
      errors.add(:entry_date, "cannot be in the future")
    end
  end

  # Month summary statistics
  def self.month_summary(user, year, month)
    moods = for_user(user).for_month(year, month)

    {
      total_entries: moods.count,
      average_level: moods.average(:level)&.round(1),
      level_counts: moods.group(:level).count,
      best_day: moods.order(level: :desc).first&.entry_date,
      worst_day: moods.order(level: :asc).first&.entry_date
    }
  end
end
