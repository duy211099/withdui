require "test_helper"

class LocaleControllerTest < ActionDispatch::IntegrationTest
  test "should switch to valid locale" do
    post switch_locale_path(locale: :en)
    assert_redirected_to root_path
    assert_equal "en", cookies[:locale]
  end

  test "should switch to Vietnamese locale" do
    post switch_locale_path(locale: :vi)
    assert_redirected_to root_path
    assert_equal "vi", cookies[:locale]
  end

  test "should reject invalid locale" do
    post switch_locale_path(locale: :invalid)
    assert_redirected_to root_path
    assert_nil cookies[:locale]
  end

  test "should redirect back to referer when available" do
    post switch_locale_path(locale: :en), headers: { "HTTP_REFERER" => about_path }
    assert_redirected_to about_path
  end

  test "cookie should expire in 1 year" do
    post switch_locale_path(locale: :en)

    # Cookie should be set
    assert_equal "en", cookies[:locale]
  end

  test "should set flash notice on successful switch" do
    post switch_locale_path(locale: :en)
    assert_not_nil flash[:notice]
  end

  test "should set flash alert on invalid locale" do
    post switch_locale_path(locale: :invalid)
    assert_equal "Invalid locale", flash[:alert]
  end
end
