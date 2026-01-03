# PaperTrail::Version model
# Stores historical versions of tracked models
# == Schema Information
#
# Table name: versions
#
#  id         :bigint           not null, primary key
#  event      :string           not null
#  item_type  :string           not null
#  object     :text
#  whodunnit  :string
#  created_at :datetime
#  item_id    :string           not null
#
# Indexes
#
#  index_versions_on_item_type_and_item_id  (item_type,item_id)
#
class Version < PaperTrail::Version
  # You can add custom associations or methods here if needed
  # For example, to associate versions with users:
  # belongs_to :user, foreign_key: :whodunnit, optional: true
end
