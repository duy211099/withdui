# frozen_string_literal: true

# UserDetailedSerializer - Extended user info including OAuth provider data
#
# Use this for: admin views, OAuth-related displays, account settings
class UserDetailedSerializer < BaseSerializer
  object_as :user, model: :User

  attributes :id, :name, :email, :avatar_url, :role, :provider, :uid, :created_at, :updated_at
end
