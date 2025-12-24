class ApplicationController < ActionController::Base
  # Include ActionPolicy for authorization
  include ActionPolicy::Controller

  # Include PaperTrail for tracking changes
  include PaperTrail::Rails::Controller

  # Ensure CSRF protection is enabled with exception strategy
  protect_from_forgery with: :exception, prepend: true

  # Set locale from cookie, params, or browser preference
  before_action :set_locale

  # Track changes with PaperTrail (who made the change)
  before_action :set_paper_trail_whodunnit

  # Dynamic sharing: Data is evaluated at render time
  inertia_share do
     {
        current_user: current_user&.as_json(only: [ :id, :email, :name, :avatar_url ]),
        is_admin: current_user&.admin? || false,
        flash: flash.to_hash,
        locale: I18n.locale.to_s,
        available_locales: I18n.available_locales.map(&:to_s)
      }
  end

  private

  def set_locale
    # Priority: 1. Cookie, 2. Default locale
    # Note: URL params are only used in LocaleController for switching
    detected_locale = locale_from_cookie || I18n.default_locale

    # Debug logging
    Rails.logger.debug "=== Locale Detection ==="
    Rails.logger.debug "Cookie value: #{cookies[:locale].inspect}"
    Rails.logger.debug "Detected locale: #{detected_locale}"
    Rails.logger.debug "Available locales: #{I18n.available_locales.inspect}"

    I18n.locale = detected_locale

    Rails.logger.debug "Set I18n.locale to: #{I18n.locale}"
    Rails.logger.debug "======================="
  end

  def locale_from_cookie
    return unless cookies[:locale].present?
    locale = cookies[:locale].to_sym
    Rails.logger.debug "locale_from_cookie: cookie=#{cookies[:locale]}, symbol=#{locale}, valid=#{I18n.available_locales.include?(locale)}"
    locale if I18n.available_locales.include?(locale)
  end

  def locale_from_header
    return unless request.env["HTTP_ACCEPT_LANGUAGE"].present?
    # Parse the Accept-Language header and find the first available locale
    accepted_locales = request.env["HTTP_ACCEPT_LANGUAGE"].scan(/[a-z]{2}/).map(&:to_sym)
    accepted_locales.find { |locale| I18n.available_locales.include?(locale) }
  end

  # Admin authorization helper
  # Redirects to homepage if user is not an admin
  def require_admin!
    unless current_user&.admin?
      redirect_to root_path, alert: "You don't have permission to access this page."
    end
  end

  # PaperTrail: Track who made the change
  def user_for_paper_trail
    current_user&.id # Store user ID in whodunnit column
  end
end
