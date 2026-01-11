class ApplicationController < ActionController::Base
  # Include ActionPolicy for authorization
  include ActionPolicy::Controller

  # Include PaperTrail for tracking changes
  include PaperTrail::Rails::Controller

  # Ensure CSRF protection is enabled with exception strategy
  protect_from_forgery with: :exception, prepend: true

  # Handle authorization failures
  rescue_from ActionPolicy::Unauthorized do |exception|
    respond_to_unauthorized(exception)
  end

  # Set current user for request-scoped access
  before_action :set_current_user

  # Set locale from cookie, params, or browser preference
  before_action :set_locale

  # Track changes with PaperTrail (who made the change)
  before_action :set_paper_trail_whodunnit

  # Dynamic sharing: Data is evaluated at render time
  inertia_share do
     {
        current_user: current_user&.as_json(only: [ :id, :email, :name, :avatar_url ]),
        user_stats: current_user&.user_stat ? UserStatsSerializer.one(current_user.user_stat) : nil,
        is_admin: current_user&.admin? || false,
        flash: flash.to_hash,
        locale: I18n.locale.to_s,
        available_locales: I18n.available_locales.map(&:to_s)
     }
  end

  private

  # Override Devise's authenticate_user! to handle Inertia.js requests properly
  def authenticate_user!(opts = {})
    return if user_signed_in?

    # Store the location the user was trying to access
    store_location_for(:user, request.fullpath) if request.get?

    # For Inertia requests, perform a redirect to login page
    if request.inertia?
      redirect_to new_user_session_path, alert: "You need to sign in to continue."
    else
      # For regular requests, use Devise's default behavior
      super(opts)
    end
  end

  # Transform validation errors to camelCase for frontend
  def form_errors(record)
    record.errors.to_hash(true)
      .transform_keys { |key| key.to_s.camelize(:lower) }
      .transform_values { |messages| Array(messages).first }
  end

  def set_current_user
    Current.user = current_user
    Current.request_id = request.uuid
    Current.user_agent = request.user_agent
  end

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

  # Handle ActionPolicy authorization failures
  def respond_to_unauthorized(exception)
    # Determine appropriate redirect location based on policy type
    policy_class = exception.policy.to_s

    redirect_location = case policy_class
    when "MoodPolicy"
      moods_path
    when "VersionPolicy"
      root_path
    when "AdminPolicy", "RegistrationPolicy", "EventPolicy"
      root_path
    else
      root_path
    end

    # Customize message for admin-only pages
    alert_message = if %w[VersionPolicy AdminPolicy RegistrationPolicy EventPolicy].include?(policy_class)
                      "Admin access required to view this page."
    else
                      "You don't have permission to access this page."
    end

    redirect_to redirect_location, alert: alert_message
  end

  # PaperTrail: Track who made the change
  def user_for_paper_trail
    current_user&.id # Store user ID in whodunnit column
  end

  # Convert Pagy object to JSON metadata for API responses
  def pagy_metadata(pagy)
    {
      page: pagy.page,
      pages: pagy.pages,
      count: pagy.count,
      limit: pagy.limit,
      next: pagy.next,
      prev: pagy.prev,
      from: pagy.from,
      to: pagy.to
    }
  end
end
