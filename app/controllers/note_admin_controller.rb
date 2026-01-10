class NoteAdminController < ApplicationController
  # Require authentication and admin authorization
  before_action :authenticate_user!, if: -> { defined?(Devise) }

  # Verify admin access for all actions
  verify_authorized

  def index
    authorize! :admin, to: :index?

    render inertia: "note/admin/Index", props: {
      posts: NotePost.all.map(&:to_json_hash)
    }
  end

  def new
    authorize! :admin, to: :create?

    render inertia: "note/admin/New", props: {
      categories: NotePost.categories,
      tags: NotePost.all_tags
    }
  end

  def create
    authorize! :admin, to: :create?

    result = NotePostWriter.create(post_params)

    if result[:success]
      NotePost.reload!

      # === GAMIFICATION HOOKS ===
      gamify_post_creation(post_params)
      # === END GAMIFICATION ===

      redirect_to note_admin_index_path, notice: t("blog.admin.post_created")
    else
      redirect_to new_note_admin_path, alert: result[:error]
    end
  end

  def edit
    authorize! :admin, to: :update?

    post = NotePost.find_by_slug(params[:slug])

    unless post
      redirect_to note_admin_index_path, alert: t("blog.post_not_found")
      return
    end

    render inertia: "note/admin/Edit", props: {
      post: post.to_json_hash,
      categories: NotePost.categories,
      tags: NotePost.all_tags
    }
  end

  def update
    authorize! :admin, to: :update?

    result = NotePostWriter.update(params[:slug], post_params)

    if result[:success]
      NotePost.reload!
      redirect_to note_admin_index_path, notice: t("blog.admin.post_updated")
    else
      redirect_to edit_note_admin_path(params[:slug]), alert: result[:error]
    end
  end

  def destroy
    authorize! :admin, to: :destroy?

    result = NotePostWriter.delete(params[:slug])

    if result[:success]
      NotePost.reload!
      redirect_to note_admin_index_path, notice: t("blog.admin.post_deleted")
    else
      redirect_to note_admin_index_path, alert: result[:error]
    end
  end

  private

  def post_params
    # Inertia sends data at root level, not nested under :post
    params.permit(
      :title, :slug, :date, :excerpt, :category, :author,
      :published, :featured_image, :content, tags: []
    )
  end

  # Gamification logic for post creation
  def gamify_post_creation(post_data)
    # Award base points for creating a post
    current_user.award_points(:post_created)

    # Award bonus points for publishing
    if post_data[:published] == "true" || post_data[:published] == true
      current_user.award_points(:post_published)
    end

    # Award bonus points for adding tags
    if post_data[:tags].present? && post_data[:tags].any?
      current_user.award_points(:post_with_tags)
    end

    # Award bonus points for long posts (> 1000 words)
    if post_data[:content].present?
      word_count = post_data[:content].split.size
      if word_count > 1000
        current_user.award_points(:long_post_bonus)
      end
    end

    # Update writing streak
    post_date = Date.parse(post_data[:date]) rescue Date.today
    current_user.update_writing_streak(post_date)

    # Update activity counter
    current_user.user_stat.increment!(:total_posts_written)
  end
end
