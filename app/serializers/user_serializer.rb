# frozen_string_literal: true

# UserSerializer - Standard user serialization with all public fields
#
# DEPRECATED: Use UserBasicSerializer or UserDetailedSerializer instead.
# This class is maintained for backward compatibility.
#
# Benefits of using Oj::Serializer-based serializers:
# 1. Performance: Uses Oj (Optimized JSON) for fast serialization
# 2. Type Safety: Automatic TypeScript type generation
# 3. Consistency: Same DSL across all serializers
# 4. Reusability: Easy to compose with other serializers
#
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
class UserSerializer < BaseSerializer
  object_as :user, model: :User

  # Basic serialization - safe for public display
  attributes :id, :name, :email, :avatar_url, :role, :created_at
end
