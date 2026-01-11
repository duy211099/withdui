# frozen_string_literal: true

# RegistrationFormSerializer - Simplified registration data for forms (without nested event)
#
# Use this for edit/new forms where you don't need the full event relationship
class RegistrationFormSerializer < BaseSerializer
  # Explicitly declare the model for type inference
  object_as :registration, model: :Registration

  attributes :id, :user_id, :how_heard

  # Nested user serialization for displaying user info in forms
  attribute :user, type: "User" do
    UserMinimalSerializer.render(registration.user) if registration.user
  end
end
