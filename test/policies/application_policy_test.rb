require "test_helper"

class ApplicationPolicyTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)
    @admin = users(:admin)
    @policy = ApplicationPolicy.new(user: @user)
  end

  test "defaults deny all actions" do
    assert_not @policy.index?
    assert_not @policy.show?
    assert_not @policy.create?
    assert_not @policy.update?
    assert_not @policy.destroy?
    assert_not @policy.manage?
  end

  test "admin? returns true for admin users" do
    admin_policy = ApplicationPolicy.new(user: @admin)
    assert admin_policy.send(:admin?)
  end

  test "admin? returns false for regular users" do
    assert_not @policy.send(:admin?)
  end

  test "admin? returns false for nil user" do
    nil_policy = ApplicationPolicy.new(user: nil)
    assert_not nil_policy.send(:admin?)
  end

  test "user? returns true when user exists" do
    assert @policy.send(:user?)
  end

  test "user? returns false when user is nil" do
    nil_policy = ApplicationPolicy.new(user: nil)
    assert_not nil_policy.send(:user?)
  end
end
