class RegistrationsController < ApplicationController
  def index
    @event = Event.find(params[:event_id])
    @registrations = @event.registrations

    render inertia: "Registrations/Index", props: {
      event: {
        id: @event.id,
        name: @event.name
      },
      registrations: @registrations.map do |registration|
        {
          id: registration.id,
          name: registration.name,
          email: registration.email,
          how_heard: registration.how_heard,
          created_at: registration.created_at.iso8601,
          event: {
            id: registration.event.id,
            name: registration.event.name,
            starts_at: registration.event.starts_at&.iso8601
          }
        }
      end
    }
  end
end
