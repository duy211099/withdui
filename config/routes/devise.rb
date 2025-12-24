# frozen_string_literal: true

# Devise authentication routes
# Handles user registration, sessions, OAuth callbacks

devise_for :users,
  controllers: {
    omniauth_callbacks: "users/omniauth_callbacks",
    sessions: "users/sessions"
  }
