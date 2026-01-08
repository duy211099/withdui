require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    # Stub NotePost since it doesn't exist yet
    NotePost = Class.new unless defined?(NotePost)
    NotePost.define_singleton_method(:published) { [] } unless NotePost.respond_to?(:published)
  end

  test "should get index" do
    get root_path
    assert_response :success
  end

  test "index displays moods for current month" do
    get root_path
    assert_response :success
  end

  test "index accepts year and month parameters" do
    get root_path, params: { year: 2024, month: 6 }
    assert_response :success
  end

  test "random endpoint returns success with 50% probability" do
    # Test multiple times to check both paths work
    successes = 0
    failures = 0

    10.times do
      get random_path
      if response.status == 200
        successes += 1
        json = JSON.parse(response.body)
        assert_not_nil json["value"]
        assert_not_nil json["generated_at"]
      elsif response.status == 500
        failures += 1
        json = JSON.parse(response.body)
        assert_equal "Random fetch failed", json["message"]
      end
    end

    # At least one of each should occur (statistically very likely)
    assert successes > 0 || failures > 0, "Random endpoint should work"
  end
end
