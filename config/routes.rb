Rails.application.routes.draw do
  devise_for :users, **{
    controllers: {
      omniauth_callbacks: "users/omniauth_callbacks",
      sessions: "users/sessions"
    }
  }

  # Locale switching
  post "locale/:locale", to: "locale#switch", as: :switch_locale

  # Blog admin routes (authenticated) - must come before wildcard routes
  get "blog/admin", to: "blog_admin#index", as: :blog_admin_index
  get "blog/admin/new", to: "blog_admin#new", as: :new_blog_admin
  post "blog/admin", to: "blog_admin#create"
  get "blog/admin/:slug/edit", to: "blog_admin#edit", as: :edit_blog_admin
  patch "blog/admin/:slug", to: "blog_admin#update"
  delete "blog/admin/:slug", to: "blog_admin#destroy"

  # Blog routes (public)
  get "blog", to: "blog#index", as: :blog_index
  get "blog/category/:category", to: "blog#category", as: :blog_category
  get "blog/tag/:tag", to: "blog#tag", as: :blog_tag
  get "blog/:year/:slug", to: "blog#show", as: :blog_post

  get "inertia-example", to: "inertia_example#index"
  get "hello", to: "inertia_example#hello"

  # Utils routes
  get "utils", to: "utils#index", as: :utils_index

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "home#index"

  # Serve empty responses for all /.well-known/* paths to prevent unnecessary 404 errors in logs.
  match "/.well-known/*path", to: proc { [ 204, {}, [ "" ] ] }, via: :all
end
