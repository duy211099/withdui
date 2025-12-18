class BlogController < ApplicationController
  # Public blog - no authentication required
  skip_before_action :authenticate_user!, if: :devise_controller_defined?, raise: false

  def index
    posts = BlogPost.published

    render inertia: "blog/Index", props: {
      posts: posts.map(&:to_json_hash),
      categories: BlogPost.categories,
      tags: BlogPost.all_tags,
      search_index: BlogSearchIndex.build
    }
  end

  def show
    year = params[:year]
    slug = params[:slug]

    Rails.logger.debug "=== Blog Post Lookup ==="
    Rails.logger.debug "Looking for: year=#{year}, slug=#{slug}"

    post = BlogPost.find_by_path(year, slug)

    Rails.logger.debug "Found post: #{post&.title || 'nil'}"
    Rails.logger.debug "Published: #{post&.published}"
    Rails.logger.debug "======================="

    if post.nil? || !post.published
      redirect_to blog_index_path, alert: t("blog.post_not_found")
      return
    end

    render inertia: "blog/Show", props: {
      post: post.to_json_hash,
      related_posts: find_related_posts(post).map(&:to_json_hash)
    }
  end

  def category
    category = params[:category]
    posts = BlogPost.by_category(category)

    render inertia: "blog/Category", props: {
      category: category,
      posts: posts.map(&:to_json_hash),
      all_categories: BlogPost.categories
    }
  end

  def tag
    tag = params[:tag]
    posts = BlogPost.by_tag(tag)

    render inertia: "blog/Category", props: {
      tag: tag,
      posts: posts.map(&:to_json_hash),
      all_tags: BlogPost.all_tags
    }
  end

  private

  def find_related_posts(post)
    # Find posts with same category or overlapping tags
    BlogPost.published
      .select { |p| p.slug != post.slug }
      .select { |p| p.category == post.category || (p.tags & post.tags).any? }
      .take(3)
  end

  def devise_controller_defined?
    defined?(Devise)
  end
end
