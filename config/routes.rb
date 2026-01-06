Rails.application.routes.draw do
  # Authentication routes
  draw :devise

  constraints subdomain: "admin" do
    # Admin-only routes (Sidekiq, Note Admin)
    draw :admin
  end

  constraints subdomain: "notes" do
    # Public note routes
    draw :notes
  end

  constraints subdomain: "moods" do
    # Mood tracker routes
    draw :moods
  end

  constraints subdomain: "events" do
    # Event routes
    draw :events
  end

  # Locale switching (available on all subdomains)
  post "locale/:locale", to: "locale#switch", as: :switch_locale

  constraints ->(req) { req.subdomain.blank? } do
    # Inertia example routes
    get "inertia-example", to: "inertia_example#index"
    get "hello", to: "inertia_example#hello"

    # Utils routes
    get "utils", to: "utils#index", as: :utils_index

    # About page
    get "about", to: "about#index", as: :about
    # Defines the root path route ("/")
    root "home#index"
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Serve empty responses for all /.well-known/* paths to prevent unnecessary 404 errors in logs.
  match "/.well-known/*path", to: proc { [ 204, {}, [ "" ] ] }, via: :all

  # Test routes (development only)
  if Rails.env.development?
    get "test/sentry", to: "test#sentry"
  end
end
