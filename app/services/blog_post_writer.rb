class BlogPostWriter
  CONTENT_DIR = Rails.root.join("app", "content", "posts")

  class << self
    def create(params)
      # Security: Validate slug to prevent directory traversal
      return { success: false, error: "Invalid slug" } unless valid_slug?(params[:slug])

      date = parse_date(params[:date])
      return { success: false, error: "Invalid date" } unless date

      year_dir = CONTENT_DIR.join(date.year.to_s)
      FileUtils.mkdir_p(year_dir)

      file_path = year_dir.join("#{params[:slug]}.mdx")

      if File.exist?(file_path)
        return { success: false, error: "Post already exists" }
      end

      File.write(file_path, build_content(params))

      { success: true, file_path: file_path.to_s }
    rescue => e
      { success: false, error: e.message }
    end

    def update(slug, params)
      return { success: false, error: "Invalid slug" } unless valid_slug?(slug)

      post = BlogPost.find_by_slug(slug)
      return { success: false, error: "Post not found" } unless post

      # If slug changed, rename file
      if params[:slug] != slug
        return { success: false, error: "Invalid new slug" } unless valid_slug?(params[:slug])

        new_path = File.dirname(post.file_path) + "/#{params[:slug]}.mdx"
        File.rename(post.file_path, new_path)
        file_path = new_path
      else
        file_path = post.file_path
      end

      File.write(file_path, build_content(params))

      { success: true, file_path: file_path.to_s }
    rescue => e
      { success: false, error: e.message }
    end

    def delete(slug)
      return { success: false, error: "Invalid slug" } unless valid_slug?(slug)

      post = BlogPost.find_by_slug(slug)
      return { success: false, error: "Post not found" } unless post

      File.delete(post.file_path)

      { success: true }
    rescue => e
      { success: false, error: e.message }
    end

    private

    def valid_slug?(slug)
      # Only allow alphanumeric, dash, underscore
      slug.present? && slug.match?(/\A[a-z0-9\-_]+\z/)
    end

    def parse_date(date_value)
      return nil if date_value.blank?
      return date_value if date_value.is_a?(Date)
      Date.parse(date_value.to_s)
    rescue ArgumentError
      nil
    end

    def build_content(params)
      frontmatter = {
        "title" => params[:title],
        "slug" => params[:slug],
        "date" => params[:date],
        "excerpt" => params[:excerpt],
        "category" => params[:category],
        "tags" => params[:tags] || [],
        "author" => params[:author],
        "published" => params[:published],
        "featured_image" => params[:featured_image]
      }.compact

      <<~MDX
        ---
        #{frontmatter.to_yaml.sub(/^---\n/, "")}---

        #{params[:content]}
      MDX
    end
  end
end
