# frozen_string_literal: true

# Base policy class for ActionPolicy authorization
# All policies should inherit from this class
class ApplicationPolicy < ActionPolicy::Base
  # Configure authorization context
  # This allows us to use `user` in my policy rules
  authorize :user, allow_nil: true

  # Default rules - deny everything by default for security
  default_rule :manage?

  def index?
    false
  end

  def show?
    false
  end

  def create?
    false
  end

  def update?
    false
  end

  def destroy?
    false
  end

  def manage?
    false
  end

  private

  # Helper method to check if user is admin
  def admin?
    user&.admin?
  end

  # Helper method to check if user exists (is authenticated)
  def user?
    user.present?
  end
end
