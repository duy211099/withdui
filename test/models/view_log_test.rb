# == Schema Information
#
# Table name: view_logs
#
#  id           :uuid             not null, primary key
#  ip_address   :string
#  user_agent   :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  recipient_id :uuid             not null
#
# Indexes
#
#  index_view_logs_on_recipient_id                 (recipient_id)
#  index_view_logs_on_recipient_id_and_created_at  (recipient_id,created_at)
#
# Foreign Keys
#
#  fk_rails_...  (recipient_id => recipients.id)
#
require "test_helper"

class ViewLogTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
