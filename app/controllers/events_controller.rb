class EventsController < ApplicationController
  def index
    @events = Event.all
    render inertia: "events/Index", props: { events: @events }
  end

  def show
    @event = Event.find(params[:id])
    render inertia: "events/Show", props: { event: @event }
  end

  def edit
    @event = Event.find(params[:id])

    render inertia: "events/Edit", props: { event: @event }
  end

  def update
    @event = Event.find(params[:id])

    if @event.update(event_params)
      redirect_to event_path(@event), notice: "Event updated."
    else
      render inertia: "events/Edit", props: { event: @event }
    end
  end

  private

  def event_params
    params.fetch(:event, params).permit(:name, :location, :price, :description)
  end
end
