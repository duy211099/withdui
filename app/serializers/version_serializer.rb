# frozen_string_literal: true

# VersionSerializer - Serializes PaperTrail versions for admin audit logs
# == Schema Information
#
# Table name: versions
#
#  id             :bigint           not null, primary key
#  event          :string           not null
#  item_type      :string           not null
#  object         :text
#  object_changes :text
#  whodunnit      :string
#  created_at     :datetime
#  item_id        :string           not null
#
# Indexes
#
#  index_versions_on_item_type_and_item_id  (item_type,item_id)
#
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
