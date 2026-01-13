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
class Recipient < ApplicationRecord
  belongs_to :greeting
  has_many :view_logs, dependent: :destroy

  validates :name, presence: true
  validates :token, presence: true, uniqueness: true

  before_validation :generate_token, on: :create

  def mark_viewed!(ip_address: nil, user_agent: nil)
    return if viewed_at.present?

    transaction do
      update!(viewed_at: Time.current)
      view_logs.create!(
        ip_address: ip_address,
        user_agent: user_agent
      )
    end
  end

  def mark_gave_lixi!(amount = nil)
    update!(gave_lixi: true, lixi_amount: amount)
  end

  private

  def generate_token
    self.token ||= SecureRandom.urlsafe_base64(16)
  end
end
