class MakeRegistrationsAJoinTable < ActiveRecord::Migration[8.1]
  def change
    remove_column :registrations, :name, :string
    remove_column :registrations, :email, :string

    add_column :registrations, :user_id, :uuid

    Registration.delete_all
  end
end
