class BlogAdminController < ApplicationController
  # Require authentication for admin actions
  before_action :authenticate_user!, if: -> { defined?(Devise) }
  # Note: Add authorization check here if you want to restrict to admin users only

  def index
    render inertia: "blog/admin/Index", props: {
      posts: BlogPost.all.map(&:to_json_hash)
    }
  end

  def new
    render inertia: "blog/admin/New", props: {
      categories: BlogPost.categories,
      tags: BlogPost.all_tags
    }
  end

  def create
    result = BlogPostWriter.create(post_params)

    if result[:success]
      BlogPost.reload!
      redirect_to blog_admin_index_path, notice: t("blog.admin.post_created")
    else
      redirect_to new_blog_admin_path, alert: result[:error]
    end
  end

  def edit
    post = BlogPost.find_by_slug(params[:slug])

    unless post
      redirect_to blog_admin_index_path, alert: t("blog.post_not_found")
      return
    end

    render inertia: "blog/admin/Edit", props: {
      post: post.to_json_hash,
      categories: BlogPost.categories,
      tags: BlogPost.all_tags
    }
  end

  def update
    result = BlogPostWriter.update(params[:slug], post_params)

    if result[:success]
      BlogPost.reload!
      redirect_to blog_admin_index_path, notice: t("blog.admin.post_updated")
    else
      redirect_to edit_blog_admin_path(params[:slug]), alert: result[:error]
    end
  end

  def destroy
    result = BlogPostWriter.delete(params[:slug])

    if result[:success]
      BlogPost.reload!
      redirect_to blog_admin_index_path, notice: t("blog.admin.post_deleted")
    else
      redirect_to blog_admin_index_path, alert: result[:error]
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
