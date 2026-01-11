# frozen_string_literal: true

if defined?(InertiaRails)
  InertiaRails.configure do |config|
    config.version = ViteRuby.digest
    # Only encrypt history when SSL/HTTPS is available
    # Encryption requires HTTPS - disable for local production testing
    config.use_script_element_for_initial_page = true
    config.encrypt_history = false
    config.always_include_errors_hash = true

    # Transform all props from snake_case to camelCase before sending to React
    # This ensures JavaScript naming conventions throughout the frontend
    config.prop_transformer = lambda do |props:|
      props.deep_transform_keys { |key| key.to_s.camelize(:lower) }
    end
  end
end
