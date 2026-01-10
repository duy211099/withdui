# == Schema Information
#
# Table name: events
#
#  id          :uuid             not null, primary key
#  description :text
#  location    :string
#  name        :string
#  price       :decimal(, )
#  starts_at   :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class Event < ApplicationRecord
  # Enable PaperTrail for audit logging
  has_paper_trail

  has_many :registrations, dependent: :destroy

  validates :name, presence: true
  validates :description, length: { minimum: 25 }
  validates :price, numericality: { greater_than_or_equal_to: 0 }
end
