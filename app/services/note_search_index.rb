class NoteSearchIndex
  class << self
    def build
      Rails.cache.fetch("note_search_index", expires_in: 1.hour, race_condition_ttl: 5.seconds) do
        generate_index
      end
    end

    private

    def generate_index
      NotePost.published.map do |post|
        {
          id: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: strip_markdown(post.content),
          category: post.category,
          tags: post.tags || [],
          urlPath: post.url_path
        }
      end
    end

    def strip_markdown(content)
      return "" if content.nil?

      # Remove markdown syntax for better search
      content.gsub(/[#*`\[\]\(\)!]/, " ")
             .gsub(/\s+/, " ")
             .strip
    end
  end
end
