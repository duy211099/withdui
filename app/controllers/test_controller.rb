class TestController < ApplicationController
  # Skip CSRF protection for this test endpoint
  skip_before_action :verify_authenticity_token

  def sentry
    # Test 1: Capture an exception
    begin
      1 / 0
    rescue ZeroDivisionError => exception
      Sentry.capture_exception(exception)
    end

    # Test 2: Capture a message
    Sentry.capture_message("Test message from withdui app")

    # Test 3: Capture with context
    Sentry.set_user(id: "test_user", email: "test@example.com")
    Sentry.capture_message("Test message with user context")

    render plain: <<~TEXT
      ✅ Sentry test events sent successfully!

      Events sent:
      1. ZeroDivisionError exception
      2. Test message
      3. Test message with user context

      Check your Sentry dashboard at:
      https://sentry.io/organizations/duy-dp/projects/

      Or check the Issues page:
      https://o4510585355632640.ingest.us.sentry.io/issues/

      Note: It may take a few seconds for events to appear in Sentry.
    TEXT
  end
end
