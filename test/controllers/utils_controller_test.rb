require "test_helper"

class UtilsControllerTest < ActionDispatch::IntegrationTest
  test "should get utils index" do
    get utils_index_path
    assert_response :success
  end

  test "utils page does not require authentication" do
    get utils_index_path
    assert_response :success
  end
end
