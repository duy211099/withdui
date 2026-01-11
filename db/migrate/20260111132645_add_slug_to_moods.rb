class AddSlugToMoods < ActiveRecord::Migration[8.1]
  def change
    add_column :moods, :slug, :string
    add_index :moods, :slug, unique: true
  end
end
