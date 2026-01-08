# frozen_string_literal: true

# UserSerializer - Demonstrates controlled serialization of User data
#
# Benefits:
# 1. Security: Explicitly excludes sensitive fields (encrypted_password, reset_token)
# 2. Reusability: Same serialization logic across multiple controllers
# 3. Maintainability: Single source of truth for User JSON structure
# 4. Flexibility: Easy to add computed fields or conditional logic
# == Schema Information
#
# Table name: users
#
#  id                     :uuid             not null, primary key
#  avatar_url             :string
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  name                   :string
#  provider               :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  role                   :string           default("user"), not null
#  uid                    :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_provider_and_uid      (provider,uid) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_role                  (role)
#
class UserSerializer
  attr_reader :user

  def initialize(user)
    @user = user
  end

  # Basic serialization - safe for public display
  def as_json
    {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      role: user.role,
      created_at: user.created_at
    }
  end

  # Detailed serialization - includes auth provider info
  def as_detailed_json
    as_json.merge(
      provider: user.provider,
      uid: user.uid,
      updated_at: user.updated_at
    )
  end

  # Minimal serialization - just the essentials for UI display
  def as_minimal_json
    {
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url
    }
  end

  # Class method for serializing collections efficiently
  def self.collection(users)
    users.map { |user| new(user).as_json }
  end
end
