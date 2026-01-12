# frozen_string_literal: true

# Life in Weeks visualization routes
# Requires authentication

namespace :life do
  # Main visualization page
  get "weeks", to: "weeks#show", as: :weeks

  # Update week entry (notes/memories)
  patch "weeks/:week_number", to: "weeks#update", constraints: { week_number: /\d+/ }
  put "weeks/:week_number", to: "weeks#update", constraints: { week_number: /\d+/ }

  # Delete week entry
  delete "weeks/:week_number", to: "weeks#destroy", constraints: { week_number: /\d+/ }
end
