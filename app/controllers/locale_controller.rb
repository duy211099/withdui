class LocaleController < ApplicationController
  # Switch the user's locale preference
  def switch
    locale = params[:locale]&.to_sym

    Rails.logger.debug "=== Locale Switch Request ==="
    Rails.logger.debug "Params locale: #{params[:locale]}"
    Rails.logger.debug "Symbol locale: #{locale}"
    Rails.logger.debug "Valid?: #{I18n.available_locales.include?(locale)}"

    if I18n.available_locales.include?(locale)
      # Set the locale for this request (for flash message)
      I18n.locale = locale
      Rails.logger.debug "Set I18n.locale to: #{I18n.locale}"

      # Set cookie (valid for 1 year)
      cookies[:locale] = { value: locale.to_s, expires: 1.year.from_now }
      Rails.logger.debug "Set cookie to: #{cookies[:locale]}"

      # Redirect back to the previous page or root
      redirect_back(fallback_location: root_path, notice: I18n.t("frontend.locale.switch_success"))
    else
      Rails.logger.error "Invalid locale requested: #{locale}"
      redirect_back(fallback_location: root_path, alert: "Invalid locale")
    end
    Rails.logger.debug "==========================="
  end
end
