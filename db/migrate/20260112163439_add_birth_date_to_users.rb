class AddBirthDateToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :birth_date, :date

    # Add index for performance when querying users by birth date
    add_index :users, :birth_date

    # Add comment explaining the field
    reversible do |dir|
      dir.up do
        execute <<-SQL
          COMMENT ON COLUMN users.birth_date IS
          'User birth date for Life in Weeks visualization and age calculations';
        SQL
      end
    end
  end
end
