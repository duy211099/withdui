ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup" # Set up gems listed in the Gemfile.
require "bootsnap/setup" # Speed up boot time by caching expensive operations.

# Load environment-specific dotenv files early in the boot process
# Only load files that exist to avoid errors
require "dotenv"
env_files = [
  ".env.#{ENV.fetch("RAILS_ENV", "development")}.local",
  ".env.local",
  ".env.#{ENV.fetch("RAILS_ENV", "development")}",
  ".env"
].select { |f| File.exist?(File.expand_path("../#{f}", __dir__)) }

Dotenv.overload!(*env_files) if env_files.any?
