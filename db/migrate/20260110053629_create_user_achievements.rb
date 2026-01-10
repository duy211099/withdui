class CreateUserAchievements < ActiveRecord::Migration[8.1]
  def change
    create_table :user_achievements, id: :uuid do |t|
      t.uuid :user_id, null: false
      t.uuid :achievement_id, null: false
      t.datetime :unlocked_at, null: false
      t.integer :progress, default: 0

      t.timestamps

      t.index [ :user_id, :achievement_id ], unique: true
      t.index :unlocked_at
    end

    add_foreign_key :user_achievements, :users
    add_foreign_key :user_achievements, :achievements
  end
end
