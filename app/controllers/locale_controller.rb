class LocaleController < ApplicationController
  # Skip the set_locale before_action for this controller since we handle it ourselves
  skip_before_action :set_locale, only: :switch

  # Switch the user's locale preference
  def switch
    locale = params[:locale]&.to_sym

    Rails.logger.debug "=== Locale Switch Request ==="
    Rails.logger.debug "Params locale: #{params[:locale]}"
    Rails.logger.debug "Symbol locale: #{locale}"
    Rails.logger.debug "Valid?: #{I18n.available_locales.include?(locale)}"

    if I18n.available_locales.include?(locale)
      # Set the locale FIRST for this request (for flash message)
      I18n.locale = locale
      Rails.logger.debug "Set I18n.locale to: #{I18n.locale}"

      # Set cookie (valid for 1 year)
      cookies[:locale] = { value: locale.to_s, expires: 1.year.from_now }
      Rails.logger.debug "Set cookie to: #{cookies[:locale]}"

      # Get the flash message in the NEW locale
      flash_message = I18n.t("messages.locale_switched")
      Rails.logger.debug "Flash message (#{I18n.locale}): #{flash_message}"

      # Redirect back to the previous page or root
      redirect_back(fallback_location: root_path, notice: flash_message)
    else
      Rails.logger.error "Invalid locale requested: #{locale}"
      redirect_back(fallback_location: root_path, alert: "Invalid locale")
    end
    Rails.logger.debug "==========================="
  end
end
