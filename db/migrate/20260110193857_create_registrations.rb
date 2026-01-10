class CreateRegistrations < ActiveRecord::Migration[8.1]
  def change
    create_table :registrations, id: :uuid do |t|
      t.string :name
      t.string :email
      t.string :how_heard
      t.references :event, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
