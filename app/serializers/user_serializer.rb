# frozen_string_literal: true

# UserSerializer - Demonstrates controlled serialization of User data
#
# Benefits:
# 1. Security: Explicitly excludes sensitive fields (encrypted_password, reset_token)
# 2. Reusability: Same serialization logic across multiple controllers
# 3. Maintainability: Single source of truth for User JSON structure
# 4. Flexibility: Easy to add computed fields or conditional logic
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
