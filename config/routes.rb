Rails.application.routes.draw do
  # Authentication routes
  draw :devise

  # Admin-only routes (Sidekiq, Blog Admin)
  draw :admin

  # Public blog routes
  draw :blog

  # Mood tracker routes
  draw :moods

  # Locale switching
  post "locale/:locale", to: "locale#switch", as: :switch_locale

  get "inertia-example", to: "inertia_example#index"
  get "hello", to: "inertia_example#hello"

  # Utils routes
  get "utils", to: "utils#index", as: :utils_index
  get "about", to: "about#index", as: :about

  # Test routes (development only)
  if Rails.env.development?
    get "test/sentry", to: "test#sentry"
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "home#index"

  # Serve empty responses for all /.well-known/* paths to prevent unnecessary 404 errors in logs.
  match "/.well-known/*path", to: proc { [ 204, {}, [ "" ] ] }, via: :all
end
