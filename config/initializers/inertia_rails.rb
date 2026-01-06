# frozen_string_literal: true

if defined?(InertiaRails)
  InertiaRails.configure do |config|
    config.version = ViteRuby.digest
    # Only encrypt history when SSL/HTTPS is available
    # Encryption requires HTTPS - disable for local production testing
    config.use_script_element_for_initial_page = true
    config.encrypt_history = false
    config.always_include_errors_hash = true
    config.prop_transformer = lambda do |props:|
      InertiaPropsSerializer.call(props)
    end
  end
end
