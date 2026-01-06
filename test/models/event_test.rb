# == Schema Information
#
# Table name: events
#
#  id         :uuid             not null, primary key
#  location   :string
#  name       :string
#  price      :decimal(, )
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "test_helper"

class EventTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
