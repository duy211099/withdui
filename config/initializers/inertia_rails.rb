# frozen_string_literal: true

if defined?(InertiaRails)
  InertiaRails.configure do |config|
    config.version = ViteRuby.digest
    config.encrypt_history = true
    config.always_include_errors_hash = true
  end
end
