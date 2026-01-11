# frozen_string_literal: true

module Api
  class UsersController < ApplicationController
    include Pagy::Backend

    def index
      users_query = User.order(created_at: :desc)

      if params[:q].present?
        users_query = users_query.search_by_keyword(params[:q])
                                 .reselect(:id, :name, :email, :avatar_url)
                                 .reorder(created_at: :desc)
      else
        users_query = users_query.select(:id, :name, :email, :avatar_url)
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
