class CreateDailyStreaks < ActiveRecord::Migration[8.1]
  def change
    create_table :daily_streaks, id: :uuid do |t|
      t.uuid :user_id, null: false
      t.date :streak_date, null: false
      t.string :streak_type, null: false  # 'mood', 'writing'
      t.boolean :completed, default: true

      t.timestamps

      t.index [ :user_id, :streak_type, :streak_date ], unique: true, name: 'index_daily_streaks_unique'
    end

    add_foreign_key :daily_streaks, :users
  end
end
