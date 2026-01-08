# frozen_string_literal: true

# Admin-only routes
# Requires admin role for access

require "sidekiq/web"

# Admin-only routes
authenticate :user, ->(user) { user.admin? } do
  # Sidekiq web UI
  mount Sidekiq::Web => "/sidekiq"

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
