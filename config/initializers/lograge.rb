# Lograge configuration for cleaner, structured request logging
# https://github.com/roidrage/lograge

Rails.application.configure do
  # Enable lograge for all environments (production, development, staging)
  config.lograge.enabled = true

  # Use JSON formatter for structured logging (easier to parse and analyze)
  config.lograge.formatter = Lograge::Formatters::Json.new

  # Include additional custom data in each log entry
  config.lograge.custom_options = lambda do |event|
    {
      time: event.time,
      remote_ip: event.payload[:remote_ip],
      ip: event.payload[:ip],
      x_forwarded_for: event.payload[:x_forwarded_for],
      user_agent: event.payload[:user_agent],
      user_id: event.payload[:user_id],
      exception: event.payload[:exception]&.first,
      exception_message: event.payload[:exception]&.last
    }.compact
  end

  # Add current user ID to log payload if available
  config.lograge.custom_payload do |controller|
    {
      host: controller.request.host,
      user_id: controller.current_user&.id,
      user_agent: controller.request.user_agent,
      remote_ip: controller.request.remote_ip,
      ip: controller.request.ip,
      x_forwarded_for: controller.request.headers["X-Forwarded-For"]
    }
  end

  # Keep default lograge params (method, path, format, controller, action, status, duration, view, db)
  # Additional fields can be added here if needed
end
