# frozen_string_literal: true

# Mood tracker routes
# Requires authentication
constraints subdomain: "moods" do
  resources :moods, path: "", except: [ :show ]
end
