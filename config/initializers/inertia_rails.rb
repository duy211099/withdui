# frozen_string_literal: true

if defined?(InertiaRails)
  InertiaRails.configure do |config|
    config.version = ViteRuby.digest
    config.encrypt_history = true
    config.always_include_errors_hash = true

    # Share flash messages globally with all Inertia pages
    config.share do |controller|
      {
        flash: controller.flash.to_hash
      }
    end
  end
end
