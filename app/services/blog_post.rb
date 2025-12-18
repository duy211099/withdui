class BlogPost
  include ActiveModel::Model

  attr_accessor :title, :slug, :date, :excerpt, :category, :tags,
                :author, :published, :featured_image, :content,
                :file_path

  CONTENT_DIR = Rails.root.join("app", "content", "posts")

  class << self
    def all
      Rails.cache.fetch("blog_posts_all", expires_in: 1.hour, race_condition_ttl: 5.seconds) do
        load_posts
      end
    end

    def published
      all.select(&:published)
    end

    def find_by_slug(slug)
      all.find { |post| post.slug == slug }
    end

    def find_by_path(year, slug)
      all.find { |post| post.file_path.include?("#{year}/#{slug}") }
    end

    def by_category(category)
      published.select { |post| post.category == category }
    end

    def by_tag(tag)
      published.select { |post| post.tags&.include?(tag) }
    end

    def categories
      published.map(&:category).compact.uniq.sort
    end

    def all_tags
      published.flat_map(&:tags).compact.uniq.sort
    end

    def reload!
      Rails.cache.delete("blog_posts_all")
      Rails.cache.delete("blog_search_index")
      @all = nil
      all
    end

    private

    def load_posts
      return [] unless CONTENT_DIR.exist?

      Dir.glob(CONTENT_DIR.join("**", "*.mdx")).map do |file_path|
        parse_post(file_path)
      end.compact.sort_by { |post| post.date || Date.new(1970, 1, 1) }.reverse
    end

    def parse_post(file_path)
      content = File.read(file_path)

      # Extract frontmatter using regex
      if content =~ /\A---\s*\n(.*?)\n---\s*\n(.*)\z/m
        frontmatter = YAML.safe_load($1)
        markdown_content = $2

        new(
          title: frontmatter["title"],
          slug: frontmatter["slug"],
          date: parse_date(frontmatter["date"]),
          excerpt: frontmatter["excerpt"],
          category: frontmatter["category"],
          tags: frontmatter["tags"] || [],
          author: frontmatter["author"],
          published: frontmatter["published"] != false,
          featured_image: frontmatter["featured_image"],
          content: markdown_content,
          file_path: file_path
        )
      end
    rescue => e
      Rails.logger.error "Error parsing #{file_path}: #{e.message}"
      nil
    end

    def parse_date(date_value)
      return nil if date_value.nil?
      return date_value if date_value.is_a?(Date)
      Date.parse(date_value.to_s)
    rescue ArgumentError
      nil
    end
  end

  def url_path
    return nil unless date && slug
    "/blog/#{date.year}/#{slug}"
  end

  def to_json_hash
    {
      title: title,
      slug: slug,
      date: date&.iso8601,
      excerpt: excerpt,
      category: category,
      tags: tags || [],
      author: author,
      featured_image: featured_image,
      url_path: url_path,
      content: content,
      published: published
    }
  end
end
