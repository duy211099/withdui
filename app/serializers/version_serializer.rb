# frozen_string_literal: true

# VersionSerializer - Serializes PaperTrail versions for admin audit logs
class VersionSerializer < BaseSerializer
  object_as :version, model: "PaperTrail::Version"

  attributes :id, :event, :item_type, :item_id, :object, :object_changes

  attribute :created_at do
    item.created_at.iso8601
  end

  attribute :user, type: "UserMinimal" do
    users = options[:users] || {}
    user = users[item.whodunnit.to_s]
    user ? UserMinimalSerializer.render(user) : nil
  end
end
