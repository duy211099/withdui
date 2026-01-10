# frozen_string_literal: true

# UserDetailedSerializer - Extended user info including OAuth provider data
#
# Use this for: admin views, OAuth-related displays, account settings
class UserDetailedSerializer < BaseSerializer
  object_as :user, model: :User

  attributes :id, :name, :email, :avatar_url, :role, :provider, :uid

  attribute :created_at do
    item.created_at.iso8601
  end

  attribute :updated_at do
    item.updated_at.iso8601
  end
end
