# frozen_string_literal: true

# NotePostSerializer - Serializes markdown-based blog posts
# This is for the static NotePost service object, not an ActiveRecord model.
class NotePostSerializer < BaseSerializer
  object_as :note_post

  attributes :title,
             :slug,
             :excerpt,
             :category,
             :tags,
             :author,
             :content,
             :published

  attribute :date do
    item.date&.iso8601
  end

  attribute :featured_image do
    item.featured_image
  end

  attribute :url_path do
    item.url_path
  end
end
