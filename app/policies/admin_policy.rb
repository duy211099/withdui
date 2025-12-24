# frozen_string_literal: true

# Policy for controlling access to admin areas
# Used to protect Sidekiq, Blog Admin, and other admin-only sections
class AdminPolicy < ApplicationPolicy
  # Admin area access - only admins can access
  def access?
    admin?
  end

  # Alias for common authorization checks
  alias_method :manage?, :access?
  alias_method :index?, :access?
  alias_method :show?, :access?
  alias_method :create?, :access?
  alias_method :update?, :access?
  alias_method :destroy?, :access?
end
