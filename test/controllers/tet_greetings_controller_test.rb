require "test_helper"

class TetGreetingsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    recipient = recipients(:one)
    get tet_greeting_path(token: recipient.token)
    assert_response :success
  end

  test "should get mark_viewed" do
    recipient = recipients(:one)
    post mark_viewed_tet_greeting_path(token: recipient.token)
    assert_response :success
  end

  test "should get mark_lixi" do
    recipient = recipients(:one)
    post mark_lixi_tet_greeting_path(token: recipient.token)
    assert_response :success
  end
end
