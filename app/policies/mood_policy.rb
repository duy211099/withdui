# frozen_string_literal: true

# MoodPolicy - Controls access to mood entries
#
# Authorization rules:
# - Anyone can view moods (index, show)
# - Only authenticated users can create moods
# - Only the mood owner can edit/update/destroy their moods
# - Admins can do anything
class MoodPolicy < ApplicationPolicy
  # Anyone can view the mood calendar (public)
  def index?
    true
  end

  # Anyone can view a specific mood entry (public)
  def show?
    true
  end

  # Only authenticated users can create moods
  def create?
    user?
  end

  # Only the owner or admin can edit
  def edit?
    owner_or_admin?
  end

  # Only the owner or admin can update
  def update?
    owner_or_admin?
  end

  # Only the owner or admin can destroy
  def destroy?
    owner_or_admin?
  end

  # Admin can manage all moods
  def manage?
    admin?
  end

  private

  # Check if current user owns this mood or is an admin
  def owner_or_admin?
    admin? || owner?
  end

  # Check if current user owns this mood
  def owner?
    user? && record.user_id == user.id
  end
end
