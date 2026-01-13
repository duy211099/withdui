class RecipientsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_greeting, only: [ :create ]
  before_action :set_recipient, only: [ :destroy ]

  def create
    @recipient = @greeting.recipients.build(recipient_params)

    if @recipient.save
      render json: {
        success: true,
        recipient: {
          id: @recipient.id,
          name: @recipient.name,
          token: @recipient.token,
          view_url: tet_greeting_url(@recipient.token)
        }
      }
    else
      render json: { success: false, errors: @recipient.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @recipient.destroy
    render json: { success: true }
  end

  private

  def set_greeting
    @greeting = current_user.greetings.find(params[:greeting_id])
  end

  def set_recipient
    @recipient = Recipient.find(params[:id])
    # Ensure the recipient belongs to the current user's greeting
    unless @recipient.greeting.user_id == current_user.id
      render json: { success: false, error: "Unauthorized" }, status: :forbidden
    end
  end

  def recipient_params
    params.require(:recipient).permit(:name)
  end
end
