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

      # Serialize versions for Inertia
      versions_data = @versions.map do |version|
        {
          id: version.id,
          event: version.event, # created, updated, destroyed
          item_type: version.item_type,
          item_id: version.item_id,
          whodunnit: version.whodunnit, # User ID who made the change
          object: version.object, # Previous state (JSON)
          object_changes: version.object_changes, # Changes made (JSON)
          created_at: version.created_at.iso8601,
          # Try to get the user who made the change
          user: user_info(version.whodunnit)
        }
      end

      render inertia: "admin/Versions", props: {
        versions: versions_data,
        pagy: pagy_metadata(@pagy)
      }
    end

    private

    # Get user info for the audit log
    def user_info(whodunnit)
      return nil if whodunnit.blank?

      user = User.find_by(id: whodunnit)
      return nil unless user

      {
        id: user.id,
        name: user.name,
        email: user.email
      }
    end

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
