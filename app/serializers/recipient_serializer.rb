# frozen_string_literal: true

# RecipientSerializer - Serializes recipient data with greeting link
#
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
class RecipientSerializer < BaseSerializer
  object_as :recipient, model: :Recipient

  attributes :id, :name, :token, :viewed_at, :gave_lixi

  attribute :lixi_amount, type: :number do
    item.lixi_amount&.to_f
  end

  # Generate view URL for this recipient
  attribute :view_url, type: :string do
    helpers = Rails.application.routes.url_helpers

    # Prefer full URL when a host is configured; otherwise fall back to a relative path
    host = Rails.application.routes.default_url_options[:host] ||
           Rails.application.config.action_mailer.default_url_options&.dig(:host)

    if host.present?
      helpers.tet_greeting_url(item.token, host:)
    else
      helpers.tet_greeting_path(item.token, only_path: true)
    end
  end
end
