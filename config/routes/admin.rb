# frozen_string_literal: true

# Admin-only routes
# Requires admin role for access

require "sidekiq/web"

# Sidekiq web UI - admin only
authenticate :user, ->(user) { user.admin? } do
  mount Sidekiq::Web => "/sidekiq"
end

# Note admin routes - must come before public note routes
get "note/admin", to: "note_admin#index", as: :note_admin_index
get "note/admin/new", to: "note_admin#new", as: :new_note_admin
post "note/admin", to: "note_admin#create"
get "note/admin/:slug/edit", to: "note_admin#edit", as: :edit_note_admin
patch "note/admin/:slug", to: "note_admin#update"
delete "note/admin/:slug", to: "note_admin#destroy"
