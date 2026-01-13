# frozen_string_literal: true

# GreetingListSerializer - Lightweight greeting data for list views
#
# Used in index pages where we don't need full details
class GreetingListSerializer < BaseSerializer
  object_as :greeting, model: :Greeting

  attributes :id, :title, :published, :created_at

  # Computed statistics
  attribute :total_recipients, type: :integer do
    item.recipients.count
  end

  attribute :total_views, type: :integer do
    item.total_views
  end

  attribute :total_lixi, type: :number do
    item.total_lixi_received.to_f
  end
end
