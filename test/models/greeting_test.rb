# == Schema Information
#
# Table name: greetings
#
#  id             :uuid             not null, primary key
#  message        :text
#  payment_info   :text
#  payment_method :string
#  published      :boolean          default(FALSE), not null
#  title          :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :uuid             not null
#
# Indexes
#
#  index_greetings_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class GreetingTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
