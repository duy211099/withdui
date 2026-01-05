class EventsController < ApplicationController
  def index
    events=[ "Hackathon", "Dui", "Hello" ]
    render inertia: "events/Index", props: { events: events }
  end
end
