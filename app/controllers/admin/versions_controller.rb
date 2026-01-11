# frozen_string_literal: true

module Admin
  # VersionsController - Displays PaperTrail audit logs
  #
  # Shows who changed what and when across all models in the system
  # Only accessible to admins
  class VersionsController < ApplicationController
    include Pagy::Backend

    before_action :authenticate_user!
    verify_authorized

    def index
      authorize! :version, to: :index?

      # Get all versions ordered by most recent first
      versions_query = PaperTrail::Version.order(created_at: :desc)

      # Paginate with Pagy (25 items per page)
      @pagy, @versions = pagy(versions_query, limit: 25)

      whodunnit_ids = @versions.map(&:whodunnit).compact.map(&:to_s).uniq
      users = User.where(id: whodunnit_ids).index_by { |u| u.id.to_s }

      render inertia: "admin/Versions", props: {
        versions: VersionSerializer.many(@versions, users: users),
        pagy: pagy_metadata(@pagy)
      }
    end
    private

    # Convert Pagy object to JSON for Inertia
    def pagy_metadata(pagy)
      {
        page: pagy.page,
        pages: pagy.pages,
        count: pagy.count,
        limit: pagy.limit,
        next: pagy.next,
        prev: pagy.prev,
        from: pagy.from,
        to: pagy.to
      }
    end
  end
end
