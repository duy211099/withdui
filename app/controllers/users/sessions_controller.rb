# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  def new
    render inertia: "auth/Login"
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    set_flash_message! :notice, :signed_out if signed_out
    redirect_to root_path, allow_other_host: false
  end
end
