# frozen_string_literal: true

# API routes
# JSON API endpoints for AJAX requests
namespace :api do
  resources :users, only: [ :index ]
end
