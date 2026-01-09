namespace :demo do
  desc "Enqueue demo jobs to test Solid Queue"

  # bin/rails demo:jobs
  task jobs: :environment do
    puts "\n🎯 Enqueueing demo jobs...\n"

    # 1. Immediate success job
    DemoJob.perform_later(scenario: "success", name: "Quick Task")
    puts "✅ Enqueued: Quick success job"

    # 2. Slow job
    DemoJob.perform_later(scenario: "slow", name: "Slow Task")
    puts "🐌 Enqueued: Slow job (10 seconds)"

    # 3. Job that will fail (tests retries)
    DemoJob.perform_later(scenario: "failure", name: "Failure Test")
    puts "💥 Enqueued: Job that will fail"

    # 4. Scheduled job (runs in 30 seconds)
    DemoJob.set(wait: 30.seconds).perform_later(scenario: "success", name: "Scheduled Task")
    puts "⏰ Enqueued: Job scheduled for 30 seconds from now"

    # 5. Multiple random jobs
    5.times do |i|
      DemoJob.perform_later(scenario: "random", name: "Random #{i + 1}")
    end
    puts "🎲 Enqueued: 5 random jobs (50% success rate)"

    puts "\n✨ Done! Visit http://localhost:3100/admin/jobs to see them in Mission Control\n"
  end

  desc "Enqueue a batch of jobs to test queue performance"
  task batch: :environment do
    count = ENV.fetch("COUNT", 20).to_i
    puts "\n🚀 Enqueueing #{count} jobs...\n"

    count.times do |i|
      DemoJob.perform_later(
        scenario: "success",
        name: "Batch Job #{i + 1}",
        delay: rand(1..3)
      )
    end

    puts "✅ Enqueued #{count} jobs!"
    puts "Visit http://localhost:3100/admin/jobs to watch them process\n"
  end

  desc "Clear all jobs from Solid Queue"
  task clear: :environment do
    puts "\n🗑️  Clearing all jobs...\n"

    deleted = {
      ready: SolidQueue::ReadyExecution.delete_all,
      scheduled: SolidQueue::ScheduledExecution.delete_all,
      claimed: SolidQueue::ClaimedExecution.delete_all,
      failed: SolidQueue::FailedExecution.delete_all,
      jobs: SolidQueue::Job.delete_all
    }

    puts "Deleted:"
    deleted.each { |type, count| puts "  #{type}: #{count}" }
    puts "\n✨ Queue cleared!\n"
  end
end
