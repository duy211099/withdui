# frozen_string_literal: true

# LifeWeekEntrySerializer - Serializes life week entries with notes
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
class LifeWeekEntrySerializer < BaseSerializer
  object_as :entry, model: :LifeWeekEntry

  attributes :id, :week_number, :notes, :memories, :created_at, :updated_at

  # Date range for this week
  attribute :date_range do
    item.date_range
  end

  # Life stage for this week
  attribute :life_stage, type: :string do
    item.life_stage.to_s
  end

  # Year and week of year
  attribute :year_and_week do
    item.year_and_week
  end
end
