# frozen_string_literal: true

# Lunar New Year greeting routes
# Authenticated routes for managing greetings
resources :greetings do
  member do
    post :publish
    post :unpublish
  end
  resources :recipients, only: [ :create, :destroy ], shallow: true
end

# Public routes for viewing greetings (no authentication)
get "tet/:token", to: "tet_greetings#show", as: :tet_greeting
post "tet/:token/mark_viewed", to: "tet_greetings#mark_viewed", as: :mark_viewed_tet_greeting
post "tet/:token/mark_lixi", to: "tet_greetings#mark_lixi", as: :mark_lixi_tet_greeting
