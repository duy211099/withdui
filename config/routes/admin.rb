# frozen_string_literal: true

# Admin-only routes
# Requires admin role for access

require "sidekiq/web"

# Admin-only routes
authenticate :user, ->(user) { user.admin? } do
  # Sidekiq web UI
  mount Sidekiq::Web => "/sidekiq"
end
