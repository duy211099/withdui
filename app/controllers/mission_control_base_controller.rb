# Base controller for Mission Control - Jobs
# Ensures only admin users can access the dashboard
class MissionControlBaseController < ApplicationController
  before_action :authenticate_admin_user!

  private

  # Custom authentication that handles both HTML and non-HTML requests
  def authenticate_admin_user!
    Rails.logger.info "=== MissionControlBaseController#authenticate_admin_user! called ==="
    Rails.logger.info "user_signed_in?: #{user_signed_in?}"
    Rails.logger.info "current_user: #{current_user.inspect}"
    Rails.logger.info "current_user.admin?: #{current_user&.admin?}"

    # Check if user is signed in
    unless user_signed_in?
      Rails.logger.info "Redirecting to sign in"
      redirect_to new_user_session_path, alert: "Please sign in to access this page."
      return
    end

    # Check if user is admin
    unless current_user.admin?
      Rails.logger.info "Redirecting to root - not admin"
      redirect_to root_path, alert: "Access denied. Admin privileges required."
    end

    Rails.logger.info "=== Authentication passed ==="
  end
end
