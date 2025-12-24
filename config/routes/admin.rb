# frozen_string_literal: true

# Admin-only routes
# Requires admin role for access

require "sidekiq/web"

# Sidekiq web UI - admin only
authenticate :user, ->(user) { user.admin? } do
  mount Sidekiq::Web => "/sidekiq"
end

# Blog admin routes - must come before public blog routes
get "blog/admin", to: "blog_admin#index", as: :blog_admin_index
get "blog/admin/new", to: "blog_admin#new", as: :new_blog_admin
post "blog/admin", to: "blog_admin#create"
get "blog/admin/:slug/edit", to: "blog_admin#edit", as: :edit_blog_admin
patch "blog/admin/:slug", to: "blog_admin#update"
delete "blog/admin/:slug", to: "blog_admin#destroy"
