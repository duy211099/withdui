class EventsController < ApplicationController
  def index
    render inertia: "events/Index"
  end
end
