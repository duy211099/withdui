# frozen_string_literal: true

# Policy for controlling access to registration management
# Only admins can manage registrations
class RegistrationPolicy < ApplicationPolicy
  # All registration actions require admin access
  def index?
    admin?
  end

  def show?
    admin?
  end

  def create?
    admin?
  end

  def update?
    admin?
  end

  def destroy?
    admin?
  end

  def manage?
    admin?
  end
end
