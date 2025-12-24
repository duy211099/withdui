class ChangeRoleToStringInUsers < ActiveRecord::Migration[8.1]
  def up
    # Remove existing index
    remove_index :users, :role if index_exists?(:users, :role)

    # Change column type to string
    change_column :users, :role, :string, default: "user", null: false

    # Convert existing integer values to string
    User.reset_column_information
    User.where(role: 0).update_all(role: "user")
    User.where(role: 1).update_all(role: "admin")

    # Add index back
    add_index :users, :role
  end

  def down
    # Remove index
    remove_index :users, :role if index_exists?(:users, :role)

    # Convert string values back to integers
    User.reset_column_information
    User.where(role: "user").update_all(role: 0)
    User.where(role: "admin").update_all(role: 1)

    # Change column type back to integer
    change_column :users, :role, :integer, default: 0, null: false

    # Add index back
    add_index :users, :role
  end
end
