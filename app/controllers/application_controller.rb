class ApplicationController < ActionController::Base
  # Dynamic sharing: Data is evaluated at render time
  # inertia_share do
  #   {
  #     user: current_user,
  #     notifications: current_user&.unread_notifications_count
  #   } if user_signed_in?
  # end
end
