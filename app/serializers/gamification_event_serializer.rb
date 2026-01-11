# frozen_string_literal: true

# GamificationEventSerializer - Serializes gamification events for dashboards/feeds
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
class GamificationEventSerializer < BaseSerializer
  object_as :gamification_event, model: :GamificationEvent

  attributes :id, :event_type, :points_earned, :metadata

  attribute :created_at do
    item.created_at.iso8601
  end
end
