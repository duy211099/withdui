# frozen_string_literal: true

# Mood tracker routes
# Requires authentication

# Custom routes for date-based mood management
get "moods/:date/edit", to: "moods#edit", as: :edit_mood_by_date, constraints: { date: /\d{4}-\d{2}-\d{2}/ }
patch "moods/:date", to: "moods#update", as: :mood_by_date, constraints: { date: /\d{4}-\d{2}-\d{2}/ }
put "moods/:date", to: "moods#update", constraints: { date: /\d{4}-\d{2}-\d{2}/ }
delete "moods/:date", to: "moods#destroy", as: :delete_mood_by_date, constraints: { date: /\d{4}-\d{2}-\d{2}/ }

# Standard resource routes (keep for index, new, create)
resources :moods, only: [ :index, :new, :create ]
