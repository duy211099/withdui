# Blog file watcher for development
# Automatically reloads blog posts when .mdx files change
#
# To enable this feature, add the 'listen' gem to your Gemfile:
# gem 'listen'

if Rails.env.development? && defined?(Listen)
  Rails.application.config.after_initialize do
    content_dir = Rails.root.join("app", "content", "posts")

    # Only start listener if content directory exists
    if content_dir.exist?
      listener = Listen.to(content_dir, only: /\.mdx$/) do |modified, added, removed|
        Rails.logger.info "Blog content changed, reloading..."
        BlogPost.reload!
      end

      listener.start
      Rails.logger.info "Blog file watcher started for #{content_dir}"
    else
      Rails.logger.info "Blog content directory not found at #{content_dir}, skipping file watcher"
    end
  end
elsif Rails.env.development?
  Rails.logger.info "Blog file watcher disabled (install 'listen' gem to enable)"
end
