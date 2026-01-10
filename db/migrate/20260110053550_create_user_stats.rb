class CreateUserStats < ActiveRecord::Migration[8.1]
  def change
    create_table :user_stats, id: :uuid do |t|
      t.uuid :user_id, null: false, index: { unique: true }

      # Points and Levels
      t.integer :total_points, default: 0, null: false
      t.integer :current_level, default: 1, null: false
      t.integer :points_to_next_level, default: 100, null: false

      # Streaks
      t.integer :current_mood_streak, default: 0, null: false
      t.integer :longest_mood_streak, default: 0, null: false
      t.date :last_mood_entry_date
      t.integer :current_writing_streak, default: 0, null: false
      t.integer :longest_writing_streak, default: 0, null: false
      t.date :last_post_date

      # Activity Counters (for achievements)
      t.integer :total_moods_logged, default: 0, null: false
      t.integer :total_posts_written, default: 0, null: false
      t.integer :total_events_attended, default: 0, null: false
      t.integer :total_great_moods, default: 0, null: false
      t.integer :total_notes_with_details, default: 0, null: false

      t.timestamps
    end

    add_foreign_key :user_stats, :users
  end
end
