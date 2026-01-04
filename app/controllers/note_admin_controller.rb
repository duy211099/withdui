class NoteAdminController < ApplicationController
  # Require authentication and admin authorization
  before_action :authenticate_user!, if: -> { defined?(Devise) }
  before_action :require_admin!

  def index
    render inertia: "note/admin/Index", props: {
      posts: NotePost.all.map(&:to_json_hash)
    }
  end

  def new
    render inertia: "note/admin/New", props: {
      categories: NotePost.categories,
      tags: NotePost.all_tags
    }
  end

  def create
    result = NotePostWriter.create(post_params)

    if result[:success]
      NotePost.reload!
      redirect_to note_admin_index_path, notice: t("blog.admin.post_created")
    else
      redirect_to new_note_admin_path, alert: result[:error]
    end
  end

  def edit
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
    result = NotePostWriter.update(params[:slug], post_params)

    if result[:success]
      NotePost.reload!
      redirect_to note_admin_index_path, notice: t("blog.admin.post_updated")
    else
      redirect_to edit_note_admin_path(params[:slug]), alert: result[:error]
    end
  end

  def destroy
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
end
