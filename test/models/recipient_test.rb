# == Schema Information
#
# Table name: recipients
#
#  id          :uuid             not null, primary key
#  gave_lixi   :boolean          default(FALSE), not null
#  lixi_amount :decimal(15, 2)
#  name        :string           not null
#  token       :string           not null
#  viewed_at   :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  greeting_id :uuid             not null
#
# Indexes
#
#  index_recipients_on_greeting_id  (greeting_id)
#  index_recipients_on_token        (token) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (greeting_id => greetings.id)
#
require "test_helper"

class RecipientTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
