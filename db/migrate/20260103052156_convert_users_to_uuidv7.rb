class ConvertUsersToUuidv7 < ActiveRecord::Migration[8.1]
  def up
    # Step 1: Add UUID column to users
    add_column :users, :uuid, :uuid

    # Step 2: Generate UUIDv7 for all existing users
    # Ruby 3.3+ includes SecureRandom.uuid_v7
    User.reset_column_information
    User.find_each do |user|
      user.update_column(:uuid, SecureRandom.uuid_v7)
    end

    change_column_null :users, :uuid, false

    # Step 3: Add UUID column to moods to store the new user reference
    add_column :moods, :user_uuid, :uuid

    # Step 4: Populate moods.user_uuid from users.uuid based on old integer ID
    execute <<-SQL
      UPDATE moods
      SET user_uuid = users.uuid
      FROM users
      WHERE moods.user_id = users.id
    SQL

    change_column_null :moods, :user_uuid, false

    # Step 5: Update versions table to support UUID item_ids
    # Change item_id from bigint to text to support both integers and UUIDs
    # First, store a mapping for User records
    execute <<-SQL
      CREATE TEMP TABLE user_version_mapping AS
      SELECT users.id::text as old_id, users.uuid::text as new_id
      FROM users
    SQL

    # Change versions.item_id to text
    change_column :versions, :item_id, :string

    # Update User version records with new UUID values
    execute <<-SQL
      UPDATE versions
      SET item_id = mapping.new_id
      FROM user_version_mapping mapping
      WHERE versions.item_type = 'User'
        AND versions.item_id = mapping.old_id
    SQL

    # Step 6: Drop old foreign key and integer columns
    remove_foreign_key :moods, :users
    remove_index :moods, column: [ :user_id, :entry_date ]
    remove_column :moods, :user_id

    # Step 7: Rename new UUID columns
    rename_column :moods, :user_uuid, :user_id

    # Step 8: Change users primary key from integer to UUID
    execute "ALTER TABLE users DROP CONSTRAINT users_pkey CASCADE"
    remove_column :users, :id
    rename_column :users, :uuid, :id
    execute "ALTER TABLE users ADD PRIMARY KEY (id)"

    # Step 9: Re-add foreign key and indexes
    add_foreign_key :moods, :users
    add_index :moods, [ :user_id, :entry_date ], unique: true
  end

  def down
    raise ActiveRecord::IrreversibleMigration, "Cannot reverse conversion from integer IDs to UUIDs"
  end
end
