# frozen_string_literal: true

# Public note routes
# Accessible to all users

get "/", to: "note#index", as: :note_index
get "category/:category", to: "note#category", as: :note_category
get "tag/:tag", to: "note#tag", as: :note_tag
get ":year/:slug", to: "note#show", as: :note_post
