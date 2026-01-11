# == Schema Information
#
# Table name: events
#
#  id          :uuid             not null, primary key
#  description :text
#  location    :string
#  name        :string
#  price       :decimal(, )
#  slug        :string
#  starts_at   :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_events_on_slug  (slug) UNIQUE
#
require "test_helper"

class EventTest < ActiveSupport::TestCase
  test "valid event with all required attributes" do
    event = Event.new(
      name: "Test Event",
      description: "This is a test description that is long enough to pass validation",
      price: 10.0
    )
    assert event.valid?
  end

  test "requires name" do
    event = Event.new(
      description: "This is a test description that is long enough to pass validation",
      price: 10.0
    )
    assert_not event.valid?
    assert_includes event.errors[:name], "can't be blank"
  end

  test "requires description with minimum 25 characters" do
    event = Event.new(
      name: "Test Event",
      description: "Too short",
      price: 10.0
    )
    assert_not event.valid?
    assert_includes event.errors[:description], "is too short (minimum is 25 characters)"
  end

  test "accepts description with exactly 25 characters" do
    event = Event.new(
      name: "Test Event",
      description: "a" * 25,
      price: 10.0
    )
    assert event.valid?
  end

  test "requires price to be non-negative" do
    event = Event.new(
      name: "Test Event",
      description: "This is a test description that is long enough to pass validation",
      price: -5.0
    )
    assert_not event.valid?
    assert_includes event.errors[:price], "must be greater than or equal to 0"
  end

  test "accepts price of zero" do
    event = Event.new(
      name: "Free Event",
      description: "This is a test description that is long enough to pass validation",
      price: 0.0
    )
    assert event.valid?
  end

  test "accepts positive price" do
    event = Event.new(
      name: "Paid Event",
      description: "This is a test description that is long enough to pass validation",
      price: 99.99
    )
    assert event.valid?
  end

  test "location is optional" do
    event = Event.new(
      name: "Virtual Event",
      description: "This is a test description that is long enough to pass validation",
      price: 0.0,
      location: nil
    )
    assert event.valid?
  end

  test "starts_at is optional" do
    event = Event.new(
      name: "TBD Event",
      description: "This is a test description that is long enough to pass validation",
      price: 0.0,
      starts_at: nil
    )
    assert event.valid?
  end
end
