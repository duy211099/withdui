# Note file watcher for development
# Automatically reloads note posts when .mdx files change
#
# To enable this feature, add the 'listen' gem to your Gemfile:
# gem 'listen'

if Rails.env.development? && defined?(Listen)
  Rails.application.config.after_initialize do
    content_dir = Rails.root.join("app", "content", "posts")

    # Only start listener if content directory exists
    if content_dir.exist?
      listener = Listen.to(content_dir, only: /\.mdx$/) do |modified, added, removed|
        Rails.logger.info "Note content changed, reloading..."
        NotePost.reload!
      end

      listener.start
      Rails.logger.info "Note file watcher started for #{content_dir}"
    else
      Rails.logger.info "Note content directory not found at #{content_dir}, skipping file watcher"
    end
  end
elsif Rails.env.development?
  Rails.logger.info "Note file watcher disabled (install 'listen' gem to enable)"
end
