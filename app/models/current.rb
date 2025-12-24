# frozen_string_literal: true

# Current attributes for request-scoped state
# This provides thread-safe global access to request-specific data
# Automatically reset between requests
class Current < ActiveSupport::CurrentAttributes
  # The currently authenticated user (set in ApplicationController)
  attribute :user

  # The current request ID for logging and debugging
  attribute :request_id

  # The current user agent for tracking
  attribute :user_agent
end
