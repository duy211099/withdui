# frozen_string_literal: true

# Mood tracker routes
# Requires authentication
resources :moods, except: [ :show ]
