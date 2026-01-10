# == Schema Information
#
# Table name: registrations
#
#  id         :uuid             not null, primary key
#  email      :string
#  how_heard  :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  event_id   :uuid             not null
#
# Indexes
#
#  index_registrations_on_event_id  (event_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#
class Registration < ApplicationRecord
  belongs_to :event

  HOW_HEARD_OPTIONS = [
    "Newsletters",
    "Blog",
    "Threads",
    "Web Search",
    "Friend/Coworker",
    "Other"
  ]

  validates :name, presence: true
  validates :email, format: { with: /\S+@\S+/ }
  validates :how_heard, inclusion: { in: HOW_HEARD_OPTIONS }
end
