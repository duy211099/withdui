# frozen_string_literal: true

# UserBasicSerializer - Basic user info for most common use cases
#
# Use this for: profiles, comments, general user references
class UserBasicSerializer < BaseSerializer
  object_as :user, model: :User

  attributes :id, :name, :email, :avatar_url, :role, :created_at
end
