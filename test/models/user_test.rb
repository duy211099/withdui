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
require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "valid user with email and password" do
    user = User.new(
      email: "test@example.com",
      password: "password123"
    )
    assert user.valid?
  end

  test "requires email" do
    user = User.new(password: "password123")
    assert_not user.valid?
    assert_includes user.errors[:email], "can't be blank"
  end

  test "requires password for non-OAuth users" do
    user = User.new(email: "test@example.com")
    assert_not user.valid?
    assert_includes user.errors[:password], "can't be blank"
  end

  test "requires unique email" do
    user1 = users(:one)
    user2 = User.new(
      email: user1.email,
      password: "password123"
    )
    assert_not user2.valid?
    assert_includes user2.errors[:email], "has already been taken"
  end

  test "defaults role to user" do
    user = users(:one)
    assert_equal "user", user.role
    assert user.user?
    assert_not user.admin?
  end

  test "can be created as admin" do
    user = users(:admin)
    assert_equal "admin", user.role
    assert user.admin?
    assert_not user.user?
  end

  test "has many moods" do
    user = users(:one)
    assert_respond_to user, :moods
  end

  test "destroys dependent moods" do
    user = users(:one)
    initial_mood_count = user.moods.count
    assert initial_mood_count > 0, "User should have moods"

    assert_difference "Mood.count", -initial_mood_count do
      user.destroy
    end
  end

  test "from_omniauth creates new user" do
    auth = OpenStruct.new(
      provider: "google_oauth2",
      uid: "12345",
      info: OpenStruct.new(
        email: "oauth@example.com",
        name: "OAuth User",
        image: "https://example.com/avatar.jpg"
      )
    )

    assert_difference "User.count", 1 do
      user = User.from_omniauth(auth)
      assert_equal "oauth@example.com", user.email
      assert_equal "OAuth User", user.name
      assert_equal "google_oauth2", user.provider
      assert_equal "12345", user.uid
      assert_equal "https://example.com/avatar.jpg", user.avatar_url
      assert_not_nil user.id, "User should have a UUID primary key"
    end
  end

  test "from_omniauth finds existing user by provider and uid" do
    auth = OpenStruct.new(
      provider: "google_oauth2",
      uid: "67890",
      info: OpenStruct.new(
        email: "another@example.com",
        name: "Another User",
        image: "https://example.com/avatar2.jpg"
      )
    )

    # First call creates the user
    user1 = nil
    assert_difference "User.count", 1 do
      user1 = User.from_omniauth(auth)
      assert_not_nil user1.id, "Created user should have UUID"
    end

    # Second call with same provider/uid finds the same user
    assert_no_difference "User.count" do
      user2 = User.from_omniauth(auth)
      assert_equal user1.id, user2.id
    end
  end
end
