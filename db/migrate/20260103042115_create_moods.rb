class CreateMoods < ActiveRecord::Migration[8.1]
  def change
    # Rails 8.1 will automatically generate UUIDv7 for id column
    create_table :moods, id: :uuid do |t|
      # Foreign key will be UUID after users table migration
      t.uuid :user_id, null: false

      # Mood level (1-5: terrible, bad, okay, good, great)
      t.integer :level, null: false

      # Date of the mood entry (one per user per day)
      t.date :entry_date, null: false

      # Optional journal notes
      t.text :notes

      # Metadata
      t.timestamps
    end

    # Add foreign key constraint
    add_foreign_key :moods, :users

    # Compound unique index: one mood per user per day
    add_index :moods, [ :user_id, :entry_date ], unique: true

    # Index for efficient date-range queries
    add_index :moods, :entry_date

    # Index for mood level filtering/analytics
    add_index :moods, :level
  end
end
