# frozen_string_literal: true

# User profile routes
# Requires authentication

get "profile", to: "users#profile", as: :profile
patch "profile", to: "users#update_profile"
