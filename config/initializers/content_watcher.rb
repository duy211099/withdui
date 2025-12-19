# Watch content files for changes and reload blog cache in development
if Rails.env.development?
  require "listen"

  content_path = Rails.root.join("app", "content", "posts")

  listener = Listen.to(content_path) do |modified, added, removed|
    if (modified + added + removed).any? { |f| f.end_with?(".mdx") }
      Rails.logger.info "📝 Content changed, reloading blog cache..."
      BlogPost.reload!
      BlogSearchIndex.reload! if defined?(BlogSearchIndex)
    end
  end

  listener.start
  Rails.logger.info "👀 Watching #{content_path} for MDX changes..."
end
