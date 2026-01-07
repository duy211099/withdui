class EventsController < ApplicationController
  def index
    @events = Event.all
    render inertia: "events/Index", props: { events: @events }
  end

  def show
    @event = Event.find(params[:id])
    render inertia: "events/Show", props: { event: @event }
  end
end
