# frozen_string_literal: true

# Admin-only routes
# Requires admin role for access

# Mission Control - Jobs dashboard (authentication handled by MissionControlBaseController)
mount MissionControl::Jobs::Engine, at: "/admin/jobs"

# Admin-only routes - Protected by ActionPolicy in controllers
authenticate :user do
  authenticate :user, ->(user) { user.admin? } do
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
