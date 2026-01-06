class EventsController < ApplicationController
  def index
    events = Event.all
    render inertia: "events/Index", props: { events: events }
  end
end
