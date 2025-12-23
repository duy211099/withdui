JsRoutes.setup do |config|
  # Module type for modern ES6 imports
  config.module_type = "ESM"

  # Namespace for the routes (nil for no namespace)
  config.namespace = nil

  # Include only named routes (exclude auto-generated routes)
  config.exclude = [
    /rails_/,           # Exclude Rails internal routes
    /active_storage_/,  # Exclude Active Storage routes
    /turbo_/            # Exclude Turbo routes
  ]

  # Use compact mode for smaller file size
  config.compact = true

  # Documentation comments
  config.documentation = true
end
