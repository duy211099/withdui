# frozen_string_literal: true

module Api
  class UsersController < ApplicationController
    include Pagy::Backend

    def index
      # Build query with search if provided
      users_query = User.select(:id, :name, :email, :avatar_url)
                        .order(created_at: :desc)

      # Apply search filter if query parameter is present
      if params[:q].present?
        search_term = "%#{params[:q]}%"
        users_query = users_query.where(
          "name ILIKE ? OR email ILIKE ?",
          search_term,
          search_term
        )
      end

      # Paginate with Pagy (25 items per page by default)
      @pagy, @users = pagy(users_query, limit: 25)

      render json: {
        data: UserMinimalSerializer.many(@users),
        pagy: pagy_metadata(@pagy)
      }
    end
  end
end
