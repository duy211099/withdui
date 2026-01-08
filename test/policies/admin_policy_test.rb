require "test_helper"

class AdminPolicyTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)
    @admin = users(:admin)
  end

  test "admin user has access" do
    policy = AdminPolicy.new(user: @admin)
    assert policy.access?
    assert policy.manage?
    assert policy.index?
    assert policy.show?
    assert policy.create?
    assert policy.update?
    assert policy.destroy?
  end

  test "regular user does not have access" do
    policy = AdminPolicy.new(user: @user)
    assert_not policy.access?
    assert_not policy.manage?
    assert_not policy.index?
    assert_not policy.show?
    assert_not policy.create?
    assert_not policy.update?
    assert_not policy.destroy?
  end

  test "nil user does not have access" do
    policy = AdminPolicy.new(user: nil)
    assert_not policy.access?
    assert_not policy.manage?
  end
end
