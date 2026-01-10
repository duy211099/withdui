Rails.application.routes.draw do
  resources :registrations
  # Authentication routes
  draw :devise

  # Admin-only routes (Sidekiq, Note Admin)
  draw :admin

  # Public note routes
  draw :notes

  # Mood tracker routes
  draw :moods

  # Event routes
  draw :events

  # Gamification routes
  draw :gamification

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
