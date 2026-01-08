require "test_helper"
require "devise/test/integration_helpers"

class NoteAdminControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @admin = users(:admin)
    @user = users(:one)
  end

  test "redirects unauthenticated users from note admin index" do
    get note_admin_index_path
    assert_redirected_to new_user_session_path
  end

  test "redirects non-admin users from note admin index" do
    sign_in @user
    get note_admin_index_path
    assert_redirected_to root_path
  end

  test "allows admin users to view note admin index" do
    sign_in @admin
    get note_admin_index_path
    assert_response :success
  end
end
