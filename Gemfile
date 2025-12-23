source "https://rubygems.org"

ruby "3.4.7"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 8.1.1"

# Use PostgreSQL as the database for Active Record
gem "pg", "~> 1.5"

# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"

# Vite integration for Rails
gem "vite_rails"

# Inertia.js adapter for Rails
gem "inertia_rails"

# i18n-js for exporting Rails translations to JavaScript
gem "i18n-js", "~> 4.2"

# js-routes for exposing Rails routes to JavaScript
gem "js-routes"

# Background jobs
gem "sidekiq", "~> 7.0"

# API serialization
gem "blueprinter"

# Error tracking
gem "sentry-ruby"
gem "sentry-rails"
gem "sentry-sidekiq"

# Redis for Sidekiq/caching/Action Cable
gem "redis", ">= 4.0.1"

# Security
gem "rack-attack"

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Authentication with Devise
gem "devise"

# Google OAuth2 authentication
gem "omniauth-google-oauth2"
gem "omniauth-rails_csrf_protection"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Cloudflare R2 storage (S3-compatible)
gem "aws-sdk-s3", require: false

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri windows ]
  gem "rubocop-rails-omakase", require: false

  # Load environment variables from .env file
  gem "dotenv-rails"
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"
  gem "i18n-tasks", "~> 1.0.15"

  # Better error pages with REPL
  gem "better_errors"
  gem "binding_of_caller"

  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  gem "rack-mini-profiler"

  # File watching for content hot reload
  gem "listen", "~> 3.9"

  # Security scanner
  gem "brakeman", require: false

  # N+1 query detection
  gem "bullet"

  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem "capybara"
  gem "selenium-webdriver"
end
