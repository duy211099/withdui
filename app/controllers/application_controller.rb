class ApplicationController < ActionController::Base
  # Dynamic sharing: Data is evaluated at render time
  inertia_share do
     {
        current_user: current_user&.as_json(only: [ :id, :email, :name, :avatar_url ]),
        flash: flash.to_hash
      }
  end
end
