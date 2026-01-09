# Demo job for testing Solid Queue and Mission Control dashboard
# This job simulates various scenarios: success, failure, slow execution
class DemoJob < ApplicationJob
  queue_as :default

  # Retry failed jobs 3 times with exponential backoff
  retry_on StandardError, wait: :exponentially_longer, attempts: 3

  def perform(scenario: "success", name: "Demo", delay: 2)
    Rails.logger.info "🚀 DemoJob started: scenario=#{scenario}, name=#{name}"

    case scenario
    when "success"
      # Simulate some work
      sleep delay
      Rails.logger.info "✅ DemoJob completed successfully for #{name}"

    when "slow"
      # Simulate slow job (10 seconds)
      sleep 10
      Rails.logger.info "🐌 DemoJob completed slowly for #{name}"

    when "failure"
      # Simulate a failure
      sleep 1
      raise StandardError, "💥 Intentional failure for testing retries: #{name}"

    when "random"
      # 50% chance of success or failure
      sleep delay
      if rand < 0.5
        Rails.logger.info "✅ DemoJob randomly succeeded for #{name}"
      else
        raise StandardError, "🎲 Random failure for #{name}"
      end

    else
      Rails.logger.warn "⚠️  Unknown scenario: #{scenario}"
    end
  end
end
