class CreateAchievements < ActiveRecord::Migration[8.1]
  def change
    create_table :achievements, id: :uuid do |t|
      t.string :key, null: false, index: { unique: true }
      t.string :name, null: false
      t.text :description
      t.string :category, null: false  # 'mood', 'writing', 'social', 'milestone'
      t.string :icon
      t.string :tier  # 'bronze', 'silver', 'gold', 'platinum'
      t.integer :points_reward, default: 0
      t.jsonb :unlock_criteria
      t.integer :display_order, default: 0
      t.boolean :hidden, default: false

      t.timestamps
    end
  end
end
