class CreateViewLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :view_logs, id: :uuid do |t|
      t.uuid :recipient_id, null: false
      t.string :ip_address
      t.string :user_agent

      t.timestamps
    end

    add_foreign_key :view_logs, :recipients
    add_index :view_logs, :recipient_id
    add_index :view_logs, [ :recipient_id, :created_at ]
  end
end
