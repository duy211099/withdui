# frozen_string_literal: true

# Public routes
# Accessible to all users without authentication

# Locale switching
post "locale/:locale", to: "locale#switch", as: :switch_locale

# About page
get "about", to: "about#index", as: :about

# Random page
get "random", to: "home#random", as: :random

# Root path
root "home#index"
