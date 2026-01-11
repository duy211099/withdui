# frozen_string_literal: true

# Policy for controlling access to events
# Public can view events, only admins can manage them
class EventPolicy < ApplicationPolicy
  # Anyone can view events (index and show)
  def index?
    true
  end

  def show?
    true
  end

  # Only admins can create, update, or delete events
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
