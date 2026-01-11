# == Schema Information
#
# Table name: registrations
#
#  id         :uuid             not null, primary key
#  how_heard  :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  event_id   :uuid             not null
#  user_id    :uuid
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
  belongs_to :user

  HOW_HEARD_OPTIONS = [
    "Newsletters",
    "Blog",
    "Threads",
    "Web Search",
    "Friend/Coworker",
    "Other"
  ]

  validates :how_heard, inclusion: { in: HOW_HEARD_OPTIONS }
end
