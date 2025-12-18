# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # Ensure session is initialized before rendering login page
  before_action :ensure_session_initialized, only: :new

  def new
    # Prevent caching of login page to ensure fresh CSRF tokens
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    # Force full page reload if this is an Inertia request to get fresh CSRF token
    if request.headers["X-Inertia"]
      response.headers["X-Inertia-Location"] = request.url
      head :conflict
      return
    end

    render inertia: "auth/Login"
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))

    # Reset session to generate new CSRF token
    reset_session

    # Set flash message AFTER reset_session to preserve it
    set_flash_message! :notice, :signed_out if signed_out

    # Force a full page reload (not Inertia visit) to get fresh CSRF token
    response.headers["X-Inertia-Location"] = root_url
    head :conflict
  end

  private

  def ensure_session_initialized
    # Regenerate CSRF token for fresh login attempts
    # This ensures we always have a valid token after sign out
    if session[:_csrf_token].nil? || !signed_in?
      # Clear any stale CSRF token and let Rails generate a new one
      session.delete(:_csrf_token)
      # Force new token generation on next access
      form_authenticity_token
    end
  end
end
