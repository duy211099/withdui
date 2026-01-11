# frozen_string_literal: true

# MoodSerializer - Handles serialization of Mood data for Inertia pages
#
# Includes computed fields for mood emoji, color, and name based on level.
# These are calculated from Mood::MOOD_LEVELS constant.
#
# == Schema Information
#
# Table name: moods
#
#  id         :uuid             not null, primary key
#  entry_date :date             not null
#  level      :integer          not null
#  notes      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :uuid             not null
#
# Indexes
#
#  index_moods_on_entry_date              (entry_date)
#  index_moods_on_level                   (level)
#  index_moods_on_user_id_and_entry_date  (user_id,entry_date) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class MoodSerializer < BaseSerializer
  object_as :mood, model: :Mood

  attributes :id, :level, :notes, :entry_date, :created_at, :updated_at

  # Computed mood attributes from MOOD_LEVELS constant
  # Explicitly type these as :string for TypeScript generation
  attribute :mood_name, type: :string do
    item.mood_name
  end

  attribute :mood_emoji, type: :string do
    item.mood_emoji
  end

  attribute :mood_color, type: :string do
    item.mood_color
  end

  # Nested user data - use UserMinimalSerializer for lightweight serialization
  attribute :user do
    UserMinimalSerializer.render(item.user)
  end
end
