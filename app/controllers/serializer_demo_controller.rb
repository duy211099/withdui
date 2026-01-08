# frozen_string_literal: true

# SerializerDemoController - Demonstrates different serialization approaches
#
# This controller showcases:
# 1. Inline serialization (simple but can get messy)
# 2. Using dedicated serializer classes (clean and reusable)
# 3. Different serialization strategies (minimal, detailed)
#
# Admin-only: This is a demo/educational page for understanding serializers
class SerializerDemoController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin!

  def index
    # Get first 5 users for demo
    users = User.limit(5)

    render inertia: "SerializerDemo", props: {
      # Approach 1: Inline serialization (what you're doing now)
      inline_serialized: inline_serialize_users(users),

      # Approach 2: Using serializer class
      serializer_basic: UserSerializer.collection(users),

      # Approach 3: Detailed serialization with serializer
      serializer_detailed: users.map { |user| UserSerializer.new(user).as_detailed_json },

      # Approach 4: Minimal serialization for performance
      serializer_minimal: users.map { |user| UserSerializer.new(user).as_minimal_json },

      # Single current user example
      current_user_data: UserSerializer.new(current_user).as_json
    }
  end

  private

  # Inline serialization approach (old way)
  def inline_serialize_users(users)
    users.map do |user|
      {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        created_at: user.created_at
      }
    end
  end
end
