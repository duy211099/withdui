class CreateLifeWeekEntries < ActiveRecord::Migration[8.1]
  def change
    create_table :life_week_entries, id: :uuid do |t|
      t.uuid :user_id, null: false
      t.integer :week_number, null: false
      t.text :notes
      t.text :memories

      t.timestamps
    end

    # Foreign key constraint
    add_foreign_key :life_week_entries, :users

    # Unique constraint: one entry per user per week
    add_index :life_week_entries, [ :user_id, :week_number ],
              unique: true,
              name: "index_life_week_entries_on_user_and_week"

    # Composite index for efficient user queries
    add_index :life_week_entries, :user_id

    # Check constraint: week_number must be between 0 and 4159 (0-based indexing)
    reversible do |dir|
      dir.up do
        execute <<-SQL
          ALTER TABLE life_week_entries
          ADD CONSTRAINT check_week_number_range
          CHECK (week_number >= 0 AND week_number <= 4159);
        SQL
      end

      dir.down do
        execute "ALTER TABLE life_week_entries DROP CONSTRAINT check_week_number_range;"
      end
    end
  end
end
