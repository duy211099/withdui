class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  # Automatically generate UUIDv7 for models with UUID primary keys
  # This ensures UUID generation works consistently in all environments
  before_create :generate_uuid_primary_key, if: :uuid_primary_key?

  private

  def uuid_primary_key?
    self.class.primary_key &&
    self.class.columns_hash[self.class.primary_key]&.type == :uuid &&
    send(self.class.primary_key).nil?
  end

  def generate_uuid_primary_key
    send("#{self.class.primary_key}=", SecureRandom.uuid_v7)
  end
end
