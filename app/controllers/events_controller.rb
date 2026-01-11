class EventsController < ApplicationController
  before_action :authenticate_user!, except: [ :index, :show ]
  before_action :set_event, only: [ :show, :edit, :update, :destroy ]

  def index
    @events = Event.all
    render inertia: "events/Index", props: {
      events: EventSerializer.many(@events)
    }
  end

  def show
    render inertia: "events/Show", props: {
      event: EventSerializer.one(@event)
    }
  end

  def new
    authorize! Event, to: :create?, with: EventPolicy
    @event = Event.new

    render inertia: "events/New", props: {
      event: EventSerializer.one(@event)
    }
  end

  def create
    authorize! Event, to: :create?, with: EventPolicy
    @event = Event.new(event_params)
    if @event.save
      redirect_to event_path(@event), notice: I18n.t("frontend.events.flash.created")
    else
      render inertia: "events/New",
             props: { event: EventSerializer.one(@event), errors: form_errors(@event) },
             status: :unprocessable_entity
    end
  end

  def edit
    authorize! @event, to: :update?, with: EventPolicy

    render inertia: "events/Edit", props: {
      event: EventSerializer.one(@event)
    }
  end

  def update
    authorize! @event, to: :update?, with: EventPolicy

    if @event.update(event_params)
      redirect_to event_path(@event), notice: I18n.t("frontend.events.flash.updated")
    else
      render inertia: "events/Edit",
             props: { event: EventSerializer.one(@event), errors: form_errors(@event) },
             status: :unprocessable_entity
    end
  end

  def destroy
    authorize! @event, to: :destroy?, with: EventPolicy
    @event.destroy
    redirect_to events_path, notice: I18n.t("frontend.events.flash.deleted")
  end

  private

  def set_event
    @event = Event.find(params[:id])
  end

  def event_params
    params.fetch(:event, params).permit(:name, :location, :price, :description)
  end
end
