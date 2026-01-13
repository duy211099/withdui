class GreetingsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_greeting, only: [ :show, :edit, :update, :destroy, :publish, :unpublish ]

  def index
    @greetings = current_user.greetings.order(created_at: :desc)

    render inertia: "tet/Index", props: {
      greetings: GreetingListSerializer.render_as_hash(@greetings)
    }
  end

  def new
    render inertia: "tet/New"
  end

  def create
    @greeting = current_user.greetings.build(greeting_params)

    if @greeting.save
      # Create recipients if provided
      if params[:recipients].present?
        params[:recipients].each do |recipient_params|
          @greeting.recipients.create!(name: recipient_params[:name])
        end
      end

      redirect_to greeting_path(@greeting), notice: "Greeting created successfully!"
    else
      redirect_to new_greeting_path, inertia: { errors: @greeting.errors }
    end
  end

  def show
    render inertia: "tet/Show", props: {
      greeting: GreetingSerializer.one(@greeting),
      recipients: RecipientSerializer.many(@greeting.recipients)
    }
  end

  def edit
    render inertia: "tet/Edit", props: {
      greeting: GreetingSerializer.one(@greeting),
      recipients: RecipientSerializer.many(@greeting.recipients)
    }
  end

  def update
    if @greeting.update(greeting_params)
      # Update recipients if provided
      if params[:recipients].present?
        # Remove existing recipients not in the new list
        recipient_ids = params[:recipients].map { |r| r[:id] }.compact
        @greeting.recipients.where.not(id: recipient_ids).destroy_all

        # Create or update recipients
        params[:recipients].each do |recipient_params|
          if recipient_params[:id].present?
            recipient = @greeting.recipients.find(recipient_params[:id])
            recipient.update!(name: recipient_params[:name])
          else
            @greeting.recipients.create!(name: recipient_params[:name])
          end
        end
      end

      redirect_to greeting_path(@greeting), notice: "Greeting updated successfully!"
    else
      redirect_to edit_greeting_path(@greeting), inertia: { errors: @greeting.errors }
    end
  end

  def destroy
    @greeting.destroy
    redirect_to greetings_path, notice: "Greeting deleted successfully!"
  end

  def publish
    @greeting.update!(published: true)
    redirect_to greeting_path(@greeting), notice: "Greeting published! You can now share the links."
  end

  def unpublish
    @greeting.update!(published: false)
    redirect_to greeting_path(@greeting), notice: "Greeting unpublished."
  end

  private

  def set_greeting
    @greeting = current_user.greetings.find(params[:id])
  end

  def greeting_params
    params.require(:greeting).permit(:title, :message, :payment_method, payment_info: {})
  end
end
