# frozen_string_literal: true

# Public note routes
# Accessible to all users

get "note", to: "note#index", as: :note_index
get "note/category/:category", to: "note#category", as: :note_category
get "note/tag/:tag", to: "note#tag", as: :note_tag
get "note/:year/:slug", to: "note#show", as: :note_post
