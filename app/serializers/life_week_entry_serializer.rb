# frozen_string_literal: true

# LifeWeekEntrySerializer - Serializes life week entries with notes
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
