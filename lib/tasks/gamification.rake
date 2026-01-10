namespace :gamification do
  desc "Backfill gamification points and achievements for existing data"
  task backfill_rewards: :environment do
    puts "=== Backfilling Gamification Rewards ==="
    puts

    User.find_each do |user|
      stat = user.user_stat
      next unless stat.present?

      puts "Processing user: #{user.email}"
      stats_before = {
        points: stat.total_points,
        level: stat.current_level,
        achievements: user.user_achievements.count,
        moods: stat.total_moods_logged,
        streak: stat.current_mood_streak
      }

      # Step 1: Repopulate stat counters from existing data
      mood_count = user.moods.count
      great_moods = user.moods.where(level: 5).count
      moods_with_notes = user.moods.where.not(notes: [ nil, "" ]).count

      # Calculate streak
      moods_ordered = user.moods.order(entry_date: :asc)
      if moods_ordered.any?
        current_streak = 1
        longest_streak = 1
        last_date = moods_ordered.first.entry_date

        moods_ordered.each_cons(2) do |prev_mood, curr_mood|
          if curr_mood.entry_date == prev_mood.entry_date + 1.day
            current_streak += 1
            longest_streak = [ current_streak, longest_streak ].max
          else
            current_streak = 1
          end
          last_date = curr_mood.entry_date
        end

        # Check if streak is still active
        today = Date.today
        current_streak = 0 unless [ today, today - 1.day ].include?(last_date)
      else
        current_streak = 0
        longest_streak = 0
      end

      # Update counters (preserve points!)
      stat.update!(
        total_moods_logged: mood_count,
        total_great_moods: great_moods,
        total_notes_with_details: moods_with_notes,
        current_mood_streak: current_streak,
        longest_mood_streak: longest_streak
      )

      # Step 2: Award points for each historical mood
      user.moods.order(entry_date: :asc).each do |mood|
        user.award_points(:mood_logged, source: mood, metadata: { backfill: true, time: mood.created_at })
        user.award_points(:mood_with_notes, source: mood, metadata: { backfill: true }) if mood.notes.present?
        user.award_points(:great_mood_logged, source: mood, metadata: { backfill: true }) if mood.level == 5
      end

      # Step 3: Check for newly unlockable achievements
      puts "  Checking achievements..."
      checker = AchievementChecker.new(user, stat)
      checker.check_all_achievements

      stats_after = {
        points: stat.reload.total_points,
        level: stat.current_level,
        achievements: user.user_achievements.count,
        moods: stat.total_moods_logged,
        streak: stat.current_mood_streak
      }

      puts "  Before: #{stats_before[:points]} pts, Level #{stats_before[:level]}, #{stats_before[:moods]} moods, #{stats_before[:streak]}-day streak, #{stats_before[:achievements]} achievements"
      puts "  After:  #{stats_after[:points]} pts, Level #{stats_after[:level]}, #{stats_after[:moods]} moods, #{stats_after[:streak]}-day streak, #{stats_after[:achievements]} achievements"
      puts "  Change: +#{stats_after[:points] - stats_before[:points]} pts, +#{stats_after[:achievements] - stats_before[:achievements]} achievements"
      puts
    end

    puts "=== Backfill Complete ==="
    puts "Summary:"
    puts "  Total users processed: #{User.count}"
    puts "  Total achievements unlocked: #{UserAchievement.count}"
    puts "  Total gamification events: #{GamificationEvent.count}"
  end

  desc "Reset all gamification data (WARNING: destructive!)"
  task reset_all: :environment do
    puts "=== Resetting All Gamification Data ==="
    puts "WARNING: This will delete all points, achievements, and events!"
    print "Type 'YES' to confirm: "

    confirmation = STDIN.gets.chomp
    unless confirmation == "YES"
      puts "Aborted."
      exit
    end

    UserAchievement.delete_all
    GamificationEvent.delete_all
    DailyStreak.delete_all
    UserStat.update_all(
      total_points: 0,
      current_level: 1,
      points_to_next_level: 100,
      current_mood_streak: 0,
      longest_mood_streak: 0,
      current_writing_streak: 0,
      longest_writing_streak: 0,
      total_moods_logged: 0,
      total_posts_written: 0,
      total_events_attended: 0,
      total_great_moods: 0,
      total_notes_with_details: 0
    )

    puts "All gamification data reset successfully!"
  end

  desc "Show gamification stats for all users"
  task stats: :environment do
    puts "=== Gamification Stats ==="
    puts

    User.includes(:user_stat, :user_achievements).find_each do |user|
      puts "#{user.email}:"
      if user.user_stat
        puts "  Level: #{user.user_stat.current_level}"
        puts "  Points: #{user.user_stat.total_points}"
        puts "  Achievements: #{user.user_achievements.count}"
        puts "  Mood Streak: #{user.user_stat.current_mood_streak} days (best: #{user.user_stat.longest_mood_streak})"
        puts "  Total Moods: #{user.user_stat.total_moods_logged}"
      else
        puts "  No stats yet"
      end
      puts
    end
  end

  desc "Run all gamification tests"
  task test: :environment do
    puts "=== Running Gamification Tests ==="
    puts

    test_files = [
      "test/models/user_stat_test.rb",
      "test/models/achievement_test.rb",
      "test/models/concerns/gamifiable_test.rb",
      "test/services/gamification_service_test.rb",
      "test/services/streak_calculator_test.rb",
      "test/services/achievement_checker_test.rb",
      "test/integration/gamification_flow_test.rb"
    ]

    system("bin/rails test #{test_files.join(' ')}")
  end
end
