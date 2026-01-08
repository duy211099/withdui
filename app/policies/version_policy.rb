# frozen_string_literal: true

# VersionPolicy - Controls access to PaperTrail audit logs
#
# Authorization rules:
# - Only admins can view audit logs (sensitive information)
class VersionPolicy < ApplicationPolicy
  # All audit log actions require admin access
  def index?
    admin?
  end

  def show?
    admin?
  end

  # Alias all common actions to use the same admin check
  alias_method :manage?, :index?
  alias_method :access?, :index?
end
