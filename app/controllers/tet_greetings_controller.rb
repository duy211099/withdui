class TetGreetingsController < ApplicationController
  # No authentication required for public viewing
  skip_before_action :verify_authenticity_token, only: [ :mark_viewed, :mark_lixi ]
  before_action :set_recipient, only: [ :show, :mark_viewed, :mark_lixi ]
  before_action :check_published, only: [ :show ]

  def show
    # Mark as viewed if first time
    @recipient.mark_viewed!(
      ip_address: request.remote_ip,
      user_agent: request.user_agent
    )

    render inertia: "tet/View", props: {
      greeting: {
        title: @greeting.title,
        message: @greeting.message,
        payment_method: @greeting.payment_method,
        payment_info: @greeting.payment_info
      },
      recipient: {
        name: @recipient.name,
        viewed_at: @recipient.viewed_at
      }
    }
  end

  def mark_viewed
    @recipient.mark_viewed!(
      ip_address: request.remote_ip,
      user_agent: request.user_agent
    )

    render json: { success: true, viewed_at: @recipient.viewed_at }
  end

  def mark_lixi
    amount = params[:amount].to_f if params[:amount].present?
    @recipient.mark_gave_lixi!(amount)

    render json: { success: true, gave_lixi: true, lixi_amount: @recipient.lixi_amount }
  end

  private

  def set_recipient
    @recipient = Recipient.find_by!(token: params[:token])
    @greeting = @recipient.greeting
  end

  def check_published
    unless @greeting.published
      render inertia: "tet/Unpublished", props: {
        message: "This greeting is not yet published."
      }
    end
  end
end
