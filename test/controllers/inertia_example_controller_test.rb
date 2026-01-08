require "test_helper"
require "devise/test/integration_helpers"

class InertiaExampleControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @admin = users(:admin)
    sign_in @admin
  end

  test "should get index" do
    get inertia_example_path
    assert_response :success
  end

  test "index defaults name to World" do
    get inertia_example_path
    assert_response :success
  end

  test "index accepts custom name parameter" do
    get inertia_example_path(name: "Claude")
    assert_response :success
  end

  test "should get hello" do
    get hello_path
    assert_response :success
  end
end
