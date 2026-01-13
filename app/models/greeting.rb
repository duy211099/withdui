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
class Greeting < ApplicationRecord
  belongs_to :user
  has_many :recipients, dependent: :destroy

  validates :title, presence: true
  validates :payment_method, inclusion: { in: %w[vietqr momo zalopay bank_account], allow_blank: true }

  # Store payment info as JSON
  serialize :payment_info, coder: JSON

  def total_lixi_received
    recipients.sum(:lixi_amount) || 0
  end

  def total_views
    recipients.where.not(viewed_at: nil).count
  end

  def total_gave_lixi
    recipients.where(gave_lixi: true).count
  end
end
