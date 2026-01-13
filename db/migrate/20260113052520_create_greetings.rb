class CreateGreetings < ActiveRecord::Migration[8.1]
  def change
    create_table :greetings, id: :uuid do |t|
      t.uuid :user_id, null: false
      t.string :title, null: false
      t.text :message
      t.string :payment_method
      t.text :payment_info
      t.boolean :published, default: false, null: false

      t.timestamps
    end

    add_foreign_key :greetings, :users
    add_index :greetings, :user_id
  end
end
