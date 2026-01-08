require "test_helper"
require "devise/test/integration_helpers"

class Users::SessionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @user = users(:one)
  end

  test "should get login page" do
    get new_user_session_path
    assert_response :success
  end

  test "login page sets no-cache headers" do
    get new_user_session_path
    # Rails 8 sets simplified cache control header
    assert_equal "no-store", response.headers["Cache-Control"]
  end

  test "login page handles Inertia requests with conflict" do
    get new_user_session_path, headers: { "X-Inertia" => "true" }
    assert_response :conflict
    assert_not_nil response.headers["X-Inertia-Location"]
  end

  test "destroy signs out user" do
    sign_in @user

    delete destroy_user_session_path
    assert_response :conflict
    assert_not_nil response.headers["X-Inertia-Location"]
  end

  test "destroy forces full page reload" do
    sign_in @user

    delete destroy_user_session_path

    # Should return conflict to force full page reload
    assert_response :conflict
    assert_equal root_url, response.headers["X-Inertia-Location"]
  end
end
