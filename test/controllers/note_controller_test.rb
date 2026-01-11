require "test_helper"

class NoteControllerTest < ActionDispatch::IntegrationTest
  setup do
    # Stub NotePost and related classes since they don't exist yet
    unless defined?(NotePost)
      NotePost = Class.new do
        def self.published
          []
        end

        def self.categories
          [ "tech", "life" ]
        end

        def self.all_tags
          [ "ruby", "rails", "javascript" ]
        end

        def self.find_by_path(year, slug)
          nil
        end

        def self.by_category(category)
          []
        end

        def self.by_tag(tag)
          []
        end

        attr_accessor :title, :published, :slug, :category, :tags

        def initialize(attrs = {})
          attrs.each { |k, v| send("#{k}=", v) }
        end
      end
    end

    unless defined?(NoteSearchIndex)
      NoteSearchIndex = Class.new do
        def self.build
          []
        end
      end
    end

    unless defined?(NotePostSerializer)
      NotePostSerializer = Class.new do
        def self.one(post)
          { "title" => post.title, "slug" => post.slug }
        end

        def self.many(posts)
          posts.map { |p| one(p) }
        end
      end
    end
  end

  test "should get index" do
    get note_index_path
    assert_response :success
  end

  test "index does not require authentication" do
    get note_index_path
    assert_response :success
  end

  test "show redirects when post not found" do
    get note_post_path(year: 2024, slug: "non-existent")
    assert_redirected_to note_index_path
  end

  test "should get category page" do
    get note_category_path(category: "tech")
    assert_response :success
  end

  test "should get tag page" do
    get note_tag_path(tag: "ruby")
    assert_response :success
  end
end
