Rails.application.routes.draw do
  # Authentication routes
  draw :devise

  # Admin-only routes (Sidekiq, Note Admin)
  draw :admin

  # Public note routes
  draw :notes

  # Mood tracker routes
  draw :moods

  # Event routes | registrations
  draw :events

  # Gamification routes
  draw :gamification

  # API routes (JSON endpoints)
  draw :api

  # Utils routes
  draw :utils

  # Public routes (home, about, locale switching)
  draw :public

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Serve empty responses for all /.well-known/* paths to prevent unnecessary 404 errors in logs.
  match "/.well-known/*path", to: proc { [ 204, {}, [ "" ] ] }, via: :all
end
