# Watch content files for changes and reload note cache in development
if Rails.env.development?
  require "listen"

  content_path = Rails.root.join("app", "content", "posts")

  listener = Listen.to(content_path) do |modified, added, removed|
    if (modified + added + removed).any? { |f| f.end_with?(".mdx") }
      Rails.logger.info "📝 Content changed, reloading note cache..."
      NotePost.reload!
      NoteSearchIndex.reload! if defined?(NoteSearchIndex)
    end
  end

  listener.start
  Rails.logger.info "👀 Watching #{content_path} for MDX changes..."
end
