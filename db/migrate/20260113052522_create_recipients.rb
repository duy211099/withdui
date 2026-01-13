class CreateRecipients < ActiveRecord::Migration[8.1]
  def change
    create_table :recipients, id: :uuid do |t|
      t.uuid :greeting_id, null: false
      t.string :name, null: false
      t.string :token, null: false
      t.datetime :viewed_at
      t.boolean :gave_lixi, default: false, null: false
      t.decimal :lixi_amount, precision: 15, scale: 2

      t.timestamps
    end

    add_foreign_key :recipients, :greetings
    add_index :recipients, :greeting_id
    add_index :recipients, :token, unique: true
  end
end
