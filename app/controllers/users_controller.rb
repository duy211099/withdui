# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!

  # GET /profile
  def profile
    render inertia: "users/Profile", props: {
      user: UserSerializer.one(current_user)
    }
  end

  # PATCH /profile
  def update_profile
    if current_user.update(user_params)
      redirect_to profile_path, notice: t("frontend.profile.flash.updated")
    else
      redirect_to profile_path, alert: current_user.errors.full_messages.join(", ")
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :birth_date)
  end
end
