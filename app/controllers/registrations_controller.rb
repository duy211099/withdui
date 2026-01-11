class RegistrationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_event
  before_action :set_registration, only: [ :edit, :update, :destroy ]

  def index
    authorize! @event, to: :manage?, with: RegistrationPolicy
    @registrations = @event.registrations

    render inertia: "Registrations/Index", props: {
      event: EventSerializer.one(@event),
      registrations: RegistrationSerializer.many(@registrations)
    }
  end

  def new
    authorize! @event, to: :manage?, with: RegistrationPolicy
    registration = @event.registrations.build

    render inertia: "Registrations/Form", props: {
      event: EventSerializer.one(@event),
      registration: RegistrationFormSerializer.one(registration),
      how_heard_options: Registration::HOW_HEARD_OPTIONS,
      is_edit: false
    }
  end

  def create
    authorize! @event, to: :manage?, with: RegistrationPolicy
    @registration = @event.registrations.build(registration_params)

    if @registration.save
      redirect_to event_registrations_path(@event), notice: "Registration was successfully created."
    else
      redirect_to new_event_registration_path(@event), inertia: { errors: @registration.errors }
    end
  end

  def edit
    authorize! @registration, to: :manage?, with: RegistrationPolicy
    render inertia: "Registrations/Form", props: {
      event: EventSerializer.one(@event),
      registration: RegistrationFormSerializer.one(@registration),
      how_heard_options: Registration::HOW_HEARD_OPTIONS,
      is_edit: true
    }
  end

  def update
    authorize! @registration, to: :manage?, with: RegistrationPolicy
    if @registration.update(registration_params)
      redirect_to event_registrations_path(@event), notice: "Registration was successfully updated."
    else
      redirect_to edit_event_registration_path(@event, @registration), inertia: { errors: @registration.errors }
    end
  end

  def destroy
    authorize! @registration, to: :manage?, with: RegistrationPolicy
    @registration.destroy!
    redirect_to event_registrations_path(@event), notice: "Registration was successfully deleted."
  end

  private

  def set_event
    @event = Event.find(params[:event_id])
  end

  def set_registration
    @registration = @event.registrations.find(params[:id])
  end

  def registration_params
    params.require(:registration).permit(:user_id, :how_heard)
  end
end
