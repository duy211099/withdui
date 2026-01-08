# frozen_string_literal: true

# Admin-only routes
# Requires admin role for access

require "sidekiq/web"

# Admin-only routes - Protected by ActionPolicy in controllers
authenticate :user do
  # Sidekiq web UI - requires admin (checked via constraint)
  authenticate :user, ->(user) { user.admin? } do
    mount Sidekiq::Web => "/sidekiq"
  end

  # Audit logs (PaperTrail versions) - admin check in controller via VersionPolicy
  get "admin/versions", to: "admin/versions#index", as: :admin_versions

  # Serializer demo (for development and admin testing)
  get "serializer-demo", to: "serializer_demo#index", as: :serializer_demo

  # Inertia example routes
  get "inertia-example", to: "inertia_example#index"
  get "hello", to: "inertia_example#hello"

  # Test routes (development only)
  if Rails.env.development?
    get "test/sentry", to: "test#sentry"
  end
end
