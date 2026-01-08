source "https://rubygems.org"

ruby "3.4.7"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 8.1.1"

# Use PostgreSQL as the database for Active Record
gem "pg", "~> 1.5"

# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder", "~> 2.14"

# Vite integration for Rails
gem "vite_rails", "~> 3.0"

# Inertia.js adapter for Rails
gem "inertia_rails", "~> 3.15"

# i18n-js for exporting Rails translations to JavaScript
gem "i18n-js", "~> 4.2"

# js-routes for exposing Rails routes to JavaScript
gem "js-routes", "~> 2.3"

# Background jobs
gem "sidekiq", "~> 7.0"

# Fast JSON parsing and generation
gem "oj", "~> 3.16"

# Error tracking
gem "sentry-ruby", "~> 6.2"
gem "sentry-rails", "~> 6.2"
gem "sentry-sidekiq", "~> 6.2"

# Logging
gem "lograge", "~> 0.14"

# Redis for Sidekiq/caching/Action Cable
gem "redis", "~> 5.4"

# Security
gem "rack-attack", "~> 6.8"

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Authentication with Devise
gem "devise", "~> 4.9"

# Google OAuth2 authentication
gem "omniauth-google-oauth2", "~> 1.2"
gem "omniauth-rails_csrf_protection", "~> 2.0"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", "~> 1.18", require: false

# Cloudflare R2 storage (S3-compatible)
gem "aws-sdk-s3", "~> 1.208", require: false

# Image processing for Active Storage variants
gem "image_processing", "~> 1.2"

# ActiveRecord enhancements
gem "store_attribute", "~> 2.0"
gem "store_model", "~> 4.4"

# Soft delete functionality
gem "discard", "~> 1.4"

# Authorization framework
gem "action_policy", "~> 0.7"

# Audit trail and versioning
gem "paper_trail", "~> 17.0"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", "~> 1.11", platforms: %i[ mri windows ]
  gem "rubocop-rails-omakase", "~> 1.0", require: false

  # Load environment variables from .env file
  gem "dotenv-rails", "~> 3.1"

  # Annotate models with schema information
  gem "annotaterb", "~> 4.20"

  # Pin minitest to 5.x until Rails 8.1.1 compatibility with 6.0 is fixed
  gem "minitest", "~> 5.0"
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console", "~> 4.2"
  gem "i18n-tasks", "~> 1.0.15"

  # Better error pages with REPL
  gem "better_errors", "~> 2.10"
  gem "binding_of_caller", "~> 1.0"

  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  gem "rack-mini-profiler", "~> 4.0"

  # File watching for content hot reload
  gem "listen", "~> 3.9"

  # Security scanner
  gem "brakeman", "~> 7.1", require: false

  # N+1 query detection
  gem "bullet", "~> 8.1"

  # Database validation and consistency checking
  gem "database_validations", "~> 1.1"
  gem "database_consistency", "~> 2.1", require: false

  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem "capybara", "~> 3.40"
  gem "selenium-webdriver", "~> 4.38"
end
