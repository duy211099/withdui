# frozen_string_literal: true

# PaperTrail configuration
# https://github.com/paper-trail-gem/paper_trail

PaperTrail.config.enabled = true

# Track who made changes (current user ID)
PaperTrail.config.has_paper_trail_defaults = {
  on: [ :create, :update, :destroy ]
}

# Set whodunnit to current user ID (works with Devise)
PaperTrail.request.whodunnit = -> {
  if defined?(Current) && Current.respond_to?(:user)
    Current.user&.id
  end
}

# You can also set whodunnit in controllers:
# class ApplicationController < ActionController::Base
#   before_action :set_paper_trail_whodunnit
#
#   def user_for_paper_trail
#     current_user&.id # or current_user&.email
#   end
# end
