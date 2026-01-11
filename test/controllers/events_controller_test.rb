require "test_helper"

class EventsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @event = Event.create!(
      name: "Test Event",
      description: "This is a test event description with enough characters",
      price: 50.0,
      location: "Test Location",
      starts_at: 1.week.from_now
    )
    @admin = users(:admin)
  end

  # Index tests
  test "should get index" do
    get events_path
    assert_response :success
  end

  # Show tests
  test "should show event" do
    get event_path(@event)
    assert_response :success
  end

  # New tests
  test "should get new" do
    sign_in @admin
    get new_event_path
    assert_response :success
  end

  # Create tests
  test "should create event with valid data" do
    sign_in @admin
    assert_difference "Event.count", 1 do
      post events_path, params: {
        event: {
          name: "Unique New Event #{Time.now.to_i}",
          description: "This is a new event with valid description length",
          price: 25.0,
          location: "New Location"
        }
      }
    end

    assert_response :redirect
    follow_redirect!
    assert_response :success
  end

  test "should not create event with invalid data" do
    sign_in @admin
    assert_no_difference "Event.count" do
      post events_path, params: {
        event: {
          name: "", # Invalid: blank name
          description: "Short", # Invalid: too short
          price: -5 # Invalid: negative price
        }
      }
    end

    assert_response :unprocessable_entity
  end

  # Edit tests
  test "should get edit" do
    sign_in @admin
    get edit_event_path(@event)
    assert_response :success
  end

  # Update tests
  test "should update event with valid data" do
    sign_in @admin
    patch event_path(@event), params: {
      event: {
        name: "Updated Event Name",
        price: 75.0
      }
    }

    @event.reload
    assert_equal "Updated Event Name", @event.name
    assert_equal 75.0, @event.price
    assert_redirected_to event_path(@event)
  end

  test "should not update event with invalid data" do
    sign_in @admin
    original_name = @event.name

    patch event_path(@event), params: {
      event: {
        name: "",
        price: -10
      }
    }

    @event.reload
    assert_equal original_name, @event.name
    assert_response :unprocessable_entity
  end

  # Destroy tests
  test "should destroy event" do
    sign_in @admin
    assert_difference "Event.count", -1 do
      delete event_path(@event)
    end

    assert_redirected_to events_path
  end
end
