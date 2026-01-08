require "test_helper"

class InertiaExampleControllerTest < ActionDispatch::IntegrationTest
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
