# frozen_string_literal: true

# Gamification routes
# Dashboard, leaderboard, and progress tracking
# Requires authentication
get "gamification/dashboard", to: "gamification#dashboard", as: "gamification_dashboard"
get "gamification/leaderboard", to: "gamification#leaderboard", as: "gamification_leaderboard"
