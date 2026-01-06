Sentry.init do |config|
  config.dsn = ENV["SENTRY_DSN"]
  config.breadcrumbs_logger = [ :active_support_logger, :http_logger ]
  config.traces_sample_rate = 0.1
  config.profiles_sample_rate = 0.1
  config.send_default_pii = true

  # Enable sending logs to Sentry
  config.enable_logs = true
  # Patch Ruby logger to forward logs
  config.enabled_patches = [ :logger ]
end
