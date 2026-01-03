class AddUuidDefaultToMoodsId < ActiveRecord::Migration[8.1]
  def up
    enable_extension "pgcrypto" unless extension_enabled?("pgcrypto")

    execute <<~SQL
      ALTER TABLE moods
      ALTER COLUMN id SET DEFAULT gen_random_uuid();
    SQL
  end

  def down
    execute <<~SQL
      ALTER TABLE moods
      ALTER COLUMN id DROP DEFAULT;
    SQL
  end
end
