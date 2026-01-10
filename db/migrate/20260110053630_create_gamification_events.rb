class CreateGamificationEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :gamification_events, id: :uuid do |t|
      t.uuid :user_id, null: false
      t.string :event_type, null: false
      t.integer :points_earned, default: 0
      t.uuid :source_id
      t.string :source_type
      t.jsonb :metadata

      t.datetime :created_at, null: false

      t.index [ :user_id, :created_at ]
      t.index [ :source_type, :source_id ]
    end

    add_foreign_key :gamification_events, :users
  end
end
