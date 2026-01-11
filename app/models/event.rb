# == Schema Information
#
# Table name: events
#
#  id          :uuid             not null, primary key
#  description :text
#  location    :string
#  name        :string
#  price       :decimal(, )
#  slug        :string
#  starts_at   :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_events_on_slug  (slug) UNIQUE
#
class Event < ApplicationRecord
  # Enable PaperTrail for audit logging
  has_paper_trail

  has_many :registrations, dependent: :destroy

  validates :name, presence: true
  validates :description, length: { minimum: 25 }
  validates :price, numericality: { greater_than_or_equal_to: 0 }

  # Slug generation
  before_validation :generate_slug, on: :create

  def to_param
    slug
  end

  private

  def generate_slug
    return if slug.present?
    return unless name.present?

    base_slug = name.parameterize
    candidate_slug = base_slug
    counter = 1

    while Event.exists?(slug: candidate_slug)
      candidate_slug = "#{base_slug}-#{counter}"
      counter += 1
    end

    self.slug = candidate_slug
  end
end
