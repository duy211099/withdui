require "test_helper"
require "devise/test/integration_helpers"

class MoodsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @user = users(:one)
    @admin = users(:admin)
    @mood = moods(:one)
  end

  # Index tests
  test "index displays moods without authentication" do
    get moods_path
    assert_response :success
  end

  test "index displays moods for current month by default" do
    get moods_path
    assert_response :success
  end

  test "index filters by year and month" do
    get moods_path(year: 2024, month: 1)
    assert_response :success
  end

  test "index filters by user_id" do
    get moods_path(user_id: @user.id)
    assert_response :success
  end

  # New action tests
  test "new requires authentication" do
    get new_mood_path
    assert_redirected_to new_user_session_path
  end

  test "authenticated user can access new" do
    sign_in @user
    get new_mood_path
    assert_response :success
  end

  test "new with date parameter" do
    sign_in @user
    get new_mood_path(date: "2024-01-15")
    assert_response :success
  end

  test "new redirects to edit if mood exists for date" do
    sign_in @user
    existing_mood = @user.moods.create!(level: 4, entry_date: Date.current)

    get new_mood_path(date: Date.current)
    assert_redirected_to edit_mood_by_date_path(date: existing_mood.entry_date)
  end

  # Create tests
  test "create requires authentication" do
    assert_no_difference "Mood.count" do
      post moods_path, params: { level: 4, entry_date: Date.current }
    end
    assert_redirected_to new_user_session_path
  end

  test "authenticated user can create mood" do
    sign_in @user

    assert_difference "Mood.count", 1 do
      post moods_path, params: {
        level: 4,
        entry_date: 3.days.ago.to_date,
        notes: "Great day!"
      }
    end

    mood = Mood.last
    assert_equal @user.id, mood.user_id
    assert_equal 4, mood.level
    assert_redirected_to moods_path(year: mood.entry_date.year, month: mood.entry_date.month)
  end

  test "create with invalid data redirects back" do
    sign_in @user

    assert_no_difference "Mood.count" do
      post moods_path, params: {
        level: 10, # Invalid level
        entry_date: Date.current
      }
    end

    assert_redirected_to new_mood_path(date: Date.current)
  end

  # Edit tests
  test "edit requires authentication" do
    get edit_mood_by_date_path(date: @mood.entry_date)
    assert_redirected_to new_user_session_path
  end

  test "user can edit their own mood" do
    sign_in @user
    get edit_mood_by_date_path(date: @mood.entry_date)
    assert_response :success
  end

  test "user cannot edit another user's mood" do
    other_mood = moods(:admin_mood)
    sign_in @user

    get edit_mood_by_date_path(date: other_mood.entry_date)
    assert_redirected_to moods_path
  end

  # Update tests
  test "update requires authentication" do
    patch mood_by_date_path(date: @mood.entry_date), params: { level: 5 }
    assert_redirected_to new_user_session_path
  end

  test "user can update their own mood" do
    sign_in @user

    patch mood_by_date_path(date: @mood.entry_date), params: {
      level: 5,
      notes: "Updated notes"
    }

    @mood.reload
    assert_equal 5, @mood.level
    assert_equal "Updated notes", @mood.notes
    assert_redirected_to moods_path(year: @mood.entry_date.year, month: @mood.entry_date.month)
  end

  test "user cannot update another user's mood" do
    other_mood = moods(:admin_mood)
    sign_in @user
    original_level = other_mood.level

    patch mood_by_date_path(date: other_mood.entry_date), params: { level: 1 }

    other_mood.reload
    assert_equal original_level, other_mood.level
    assert_redirected_to moods_path
  end

  test "update with invalid data redirects back" do
    sign_in @user

    patch mood_by_date_path(date: @mood.entry_date), params: { level: 10 } # Invalid level

    assert_redirected_to edit_mood_by_date_path(date: @mood.entry_date)
  end

  # Destroy tests
  test "destroy requires authentication" do
    assert_no_difference "Mood.count" do
      delete delete_mood_by_date_path(date: @mood.entry_date)
    end
    assert_redirected_to new_user_session_path
  end

  test "user can destroy their own mood" do
    sign_in @user
    entry_date = @mood.entry_date

    assert_difference "Mood.count", -1 do
      delete delete_mood_by_date_path(date: @mood.entry_date)
    end

    assert_redirected_to moods_path(year: entry_date.year, month: entry_date.month)
  end

  test "user cannot destroy another user's mood" do
    other_mood = moods(:admin_mood)
    sign_in @user

    assert_no_difference "Mood.count" do
      delete delete_mood_by_date_path(date: other_mood.entry_date)
    end

    assert_redirected_to moods_path
  end
end
