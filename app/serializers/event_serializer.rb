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
#  starts_at   :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class EventSerializer < BaseSerializer
  object_as :event, model: :Event

  attributes :id, :name, :location, :description, :starts_at

  # Explicitly type price as number for TypeScript
  attribute :price, type: :number do
    item.price
  end
end
