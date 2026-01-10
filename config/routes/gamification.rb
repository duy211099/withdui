# frozen_string_literal: true

# Gamification routes (accessible via /stats)
# Dashboard, leaderboard, and progress tracking
# Requires authentication
get "stats/dashboard", to: "gamification#dashboard", as: "gamification_dashboard"
get "stats/leaderboard", to: "gamification#leaderboard", as: "gamification_leaderboard"
