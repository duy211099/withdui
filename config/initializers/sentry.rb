# Only initialize Sentry in production and development, not in test
unless Rails.env.test?
  Sentry.init do |config|
    config.dsn = ENV["SENTRY_DSN"]
    config.breadcrumbs_logger = [ :active_support_logger, :http_logger ]
    config.traces_sample_rate = 1.0
    config.profiles_sample_rate = 1.0
    config.send_default_pii = true
    config.debug = true
    config.logger = Logger.new($stdout)
    config.logger.level = Logger::DEBUG
  end
end
