# frozen_string_literal: true

# Note routes
# Public routes are accessible to all users

# Note owner routes - requires login
authenticate :user do
  get "note/me", to: "note_admin#index", as: :note_admin_index
  get "note/me/new", to: "note_admin#new", as: :new_note_admin
  post "note/me", to: "note_admin#create"
  get "note/me/:slug/edit", to: "note_admin#edit", as: :edit_note_admin
  patch "note/me/:slug", to: "note_admin#update"
  delete "note/me/:slug", to: "note_admin#destroy"
end

get "note", to: "note#index", as: :note_index
get "note/category/:category", to: "note#category", as: :note_category
get "note/tag/:tag", to: "note#tag", as: :note_tag
get "note/:year/:slug", to: "note#show", as: :note_post
