# frozen_string_literal: true

# RegistrationSerializer - Handles serialization of Registration data for Inertia pages
#
# Benefits:
# 1. Performance: Uses Oj (Optimized JSON) for fast serialization
# 2. Reusability: Same serialization logic across multiple controller actions
# 3. Maintainability: Single source of truth for Registration JSON structure
# 4. Flexibility: Easy to add computed fields or change structure
#
# TypeScript type (app/frontend/types/models.ts):
#   interface Registration {
#     id: string
#     name: string
#     email: string
#     how_heard: string
#     created_at: string  // ISO8601
#     event: {
#       id: string
#       name: string
#       starts_at: string | null  // ISO8601
#     }
#   }
# == Schema Information
#
# Table name: registrations
#
#  id         :uuid             not null, primary key
#  email      :string
#  how_heard  :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  event_id   :uuid             not null
#
# Indexes
#
#  index_registrations_on_event_id  (event_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#
class RegistrationSerializer < BaseSerializer
  # Explicitly declare the model for type inference
  object_as :registration, model: :Registration

  # Full serialization - includes event details
  attributes :id, :name, :email, :how_heard

  # Format timestamps as ISO8601 strings for JavaScript
  attribute :created_at do
    item.created_at.iso8601
  end

  # Nested event serialization - uses EventSerializer for auto-generated types
  attribute :event, serializer: EventSerializer
end
