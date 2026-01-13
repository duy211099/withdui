# frozen_string_literal: true

# GreetingSerializer - Full greeting data with all details
#
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
class GreetingSerializer < BaseSerializer
  object_as :greeting, model: :Greeting

  attributes :id, :title, :message, :payment_method, :published, :created_at, :updated_at

  # Payment info as JSON
  attribute :payment_info, type: :object do
    item.payment_info || {}
  end

  # Computed statistics
  attribute :total_recipients, type: :integer do
    item.recipients.count
  end

  attribute :total_views, type: :integer do
    item.total_views
  end

  attribute :total_gave_lixi, type: :integer do
    item.total_gave_lixi
  end

  attribute :total_lixi_received, type: :number do
    item.total_lixi_received.to_f
  end
end
