class RemoveGenRandomUuidDefaultFromMoods < ActiveRecord::Migration[8.1]
  def change
    # Remove database-level UUID default so Rails generates UUIDv7 at application level
    change_column_default :moods, :id, from: -> { "gen_random_uuid()" }, to: nil
  end
end
