require "test_helper"

class GreetingsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @user = users(:one)
    @greeting = greetings(:one)
    sign_in @user
  end

  test "should get index" do
    get greetings_path
    assert_response :success
  end

  test "should get new" do
    get new_greeting_path
    assert_response :success
  end

  test "should get create" do
    assert_difference "Greeting.count", 1 do
      post greetings_path, params: {
        greeting: {
          title: "New Greeting",
          message: "Happy New Year!",
          payment_method: ""
        }
      }
    end

    created = Greeting.order(created_at: :desc).first
    assert_redirected_to greeting_path(created)
  end

  test "should get show" do
    get greeting_path(@greeting)
    assert_response :success
  end

  test "should get edit" do
    get edit_greeting_path(@greeting)
    assert_response :success
  end

  test "should get update" do
    patch greeting_path(@greeting), params: {
      greeting: {
        title: "Updated Greeting",
        payment_method: ""
      }
    }

    assert_redirected_to greeting_path(@greeting)
  end

  test "should get destroy" do
    assert_difference "Greeting.count", -1 do
      delete greeting_path(@greeting)
    end

    assert_redirected_to greetings_path
  end
end
