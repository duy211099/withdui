# frozen_string_literal: true

# GamificationEventSerializer - Serializes gamification events for dashboards/feeds
class GamificationEventSerializer < BaseSerializer
  object_as :gamification_event, model: :GamificationEvent

  attributes :id, :event_type, :points_earned, :metadata

  attribute :created_at do
    item.created_at.iso8601
  end
end
