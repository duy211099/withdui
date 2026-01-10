# frozen_string_literal: true

# UserMinimalSerializer - Minimal user info for lightweight references
#
# Use this for: lists, dropdowns, nested refs, performance-critical components
# Contains: id, name, email, avatar_url
class UserMinimalSerializer < BaseSerializer
  object_as :user, model: :User

  attributes :id, :name, :email, :avatar_url
end
