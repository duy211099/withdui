# frozen_string_literal: true

# Configure Rails to use UUID for primary keys
# PostgreSQL's gen_random_uuid() generates UUIDv4
Rails.application.config.active_record.generate_secure_token_on = :initialize
