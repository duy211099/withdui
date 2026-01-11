class NoteController < ApplicationController
  # Public note - no authentication required
  skip_before_action :authenticate_user!, if: :devise_controller_defined?, raise: false

  def index
    posts = NotePost.published

    render inertia: "note/Index", props: {
      posts: NotePostSerializer.many(posts),
      categories: NotePost.categories,
      tags: NotePost.all_tags,
      search_index: NoteSearchIndex.build
    }
  end

  def show
    year = params[:year]
    slug = params[:slug]

    Rails.logger.debug "=== Note Lookup ==="
    Rails.logger.debug "Looking for: year=#{year}, slug=#{slug}"

    post = NotePost.find_by_path(year, slug)

    Rails.logger.debug "Found post: #{post&.title || 'nil'}"
    Rails.logger.debug "Published: #{post&.published}"
    Rails.logger.debug "======================="

    if post.nil? || !post.published
      redirect_to note_index_path, alert: t("blog.post_not_found")
      return
    end

    render inertia: "note/Show", props: {
      post: NotePostSerializer.one(post),
      related_posts: NotePostSerializer.many(find_related_posts(post))
    }
  end

  def category
    category = params[:category]
    posts = NotePost.by_category(category)

    render inertia: "note/Category", props: {
      category: category,
      posts: NotePostSerializer.many(posts),
      all_categories: NotePost.categories
    }
  end

  def tag
    tag = params[:tag]
    posts = NotePost.by_tag(tag)

    render inertia: "note/Category", props: {
      tag: tag,
      posts: NotePostSerializer.many(posts),
      all_tags: NotePost.all_tags
    }
  end

  private

  def find_related_posts(post)
    # Find posts with same category or overlapping tags
    NotePost.published
      .select { |p| p.slug != post.slug }
      .select { |p| p.category == post.category || (p.tags & post.tags).any? }
      .take(3)
  end

  def devise_controller_defined?
    defined?(Devise)
  end
end
