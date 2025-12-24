# frozen_string_literal: true

# Public blog routes
# Accessible to all users

get "blog", to: "blog#index", as: :blog_index
get "blog/category/:category", to: "blog#category", as: :blog_category
get "blog/tag/:tag", to: "blog#tag", as: :blog_tag
get "blog/:year/:slug", to: "blog#show", as: :blog_post
