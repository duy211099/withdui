# frozen_string_literal: true

# AchievementSerializer - Serializes achievement data for gamification views
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
class AchievementSerializer < BaseSerializer
  object_as :achievement, model: :Achievement

  attributes :id, :key, :name, :description, :category, :icon, :tier, :points_reward, :hidden
end
