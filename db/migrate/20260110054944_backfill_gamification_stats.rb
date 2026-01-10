class BackfillGamificationStats < ActiveRecord::Migration[8.1]
  def up
    # Backfill gamification stats for existing users
    User.find_each do |user|
      # Create stats if not exists
      stat = user.user_stat || user.create_user_stat!

      # Backfill mood counts
      mood_count = user.moods.count
      great_moods = user.moods.where(level: 5).count
      moods_with_notes = user.moods.where.not(notes: [ nil, "" ]).count

      # Calculate streak from existing moods
      moods_ordered = user.moods.order(entry_date: :asc)
      current_streak, longest_streak = calculate_mood_streaks(moods_ordered)

      # Update stats
      stat.update!(
        total_moods_logged: mood_count,
        total_great_moods: great_moods,
        total_notes_with_details: moods_with_notes,
        current_mood_streak: current_streak,
        longest_mood_streak: longest_streak
      )

      puts "Backfilled stats for user #{user.id}: #{mood_count} moods, #{current_streak}-day streak"
    end

    puts "Backfill complete!"
  end

  def down
    # No rollback needed - stats remain
  end

  private

  def calculate_mood_streaks(moods)
    return [ 0, 0 ] if moods.empty?

    current_streak = 1
    longest_streak = 1
    last_date = moods.first.entry_date

    moods.each_cons(2) do |prev_mood, curr_mood|
      if curr_mood.entry_date == prev_mood.entry_date + 1.day
        current_streak += 1
        longest_streak = [ current_streak, longest_streak ].max
      else
        current_streak = 1
      end
      last_date = curr_mood.entry_date
    end

    # Check if streak is still active (last entry was yesterday or today)
    today = Date.today
    current_streak = 0 unless [ today, today - 1.day ].include?(last_date)

    [ current_streak, longest_streak ]
  end
end
