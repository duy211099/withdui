# frozen_string_literal: true

# == Schema Information
#
# Table name: life_week_entries
#
#  id          :uuid             not null, primary key
#  memories    :text
#  notes       :text
#  week_number :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :uuid             not null
#
# Indexes
#
#  index_life_week_entries_on_user_and_week  (user_id,week_number) UNIQUE
#  index_life_week_entries_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class LifeWeekEntry < ApplicationRecord
  # Enable PaperTrail for audit logging (consistent with other models)
  has_paper_trail

  # Associations
  belongs_to :user

  # Validations
  validates :week_number, presence: true,
                          numericality: {
                            only_integer: true,
                            greater_than_or_equal_to: 0,
                            less_than_or_equal_to: 4159
                          },
                          uniqueness: { scope: :user_id }
  validates :notes, length: { maximum: 10_000 }
  validates :memories, length: { maximum: 10_000 }

  # Scopes
  scope :for_user, ->(user) { where(user: user) }
  scope :for_week, ->(week_num) { where(week_number: week_num) }
  scope :with_notes, -> { where.not(notes: nil).where.not(notes: "") }
  scope :ordered_by_week, -> { order(week_number: :asc) }

  # Instance methods

  # Calculate the actual date range for this week
  # @return [Hash, nil] { start_date: Date, end_date: Date } or nil if user has no birth_date
  def date_range
    return nil unless user.birth_date

    start_date = user.birth_date + (week_number * 7).days
    end_date = start_date + 6.days

    { start_date: start_date, end_date: end_date }
  end

  # Get life stage for this week
  # @return [Symbol] :childhood, :adolescence, :young_adult, :middle_adult, :late_adult
  def life_stage
    LifeWeeksService.week_to_life_stage(week_number)
  end

  # Get week's year and week-of-year
  # @return [Hash] { year: Integer, week_of_year: Integer }
  def year_and_week
    year = week_number / 52
    week_of_year = week_number % 52
    { year: year, week_of_year: week_of_year + 1 }
  end
end
