# frozen_string_literal: true

# EventSerializer - Handles serialization of Event data for Inertia pages
#
# == Schema Information
#
# Table name: events
#
#  id          :uuid             not null, primary key
#  description :text
#  location    :string
#  name        :string
#  price       :decimal(, )
#  slug        :string
#  starts_at   :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_events_on_slug  (slug) UNIQUE
#
class EventSerializer < BaseSerializer
  object_as :event, model: :Event

  attributes :id, :slug, :name, :location, :description, :starts_at

  # Explicitly type price as number for TypeScript
  attribute :price, type: :number do
    item.price
  end
end
