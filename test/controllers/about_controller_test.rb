require "test_helper"

class AboutControllerTest < ActionDispatch::IntegrationTest
  test "should get about page" do
    get about_path
    assert_response :success
  end

  test "about page does not require authentication" do
    # Ensure we're not signed in
    get about_path
    assert_response :success
  end
end
