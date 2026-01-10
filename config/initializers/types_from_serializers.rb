# frozen_string_literal: true

# Configuration for types_from_serializers gem
# Automatically generates TypeScript types from Oj::Serializer classes
#
# Documentation: https://github.com/ElMassimo/types_from_serializers

if Rails.env.development?
  # Ensure serializers are loaded before configuration
  Rails.application.config.to_prepare do
    TypesFromSerializers.config do |config|
      # Base serializer classes to detect
      # All serializers extending these classes will have types generated automatically
      config.base_serializers = [ "BaseSerializer" ]

      # Directories containing serializers
      config.serializers_dirs = [ Rails.root.join("app", "serializers") ]

      # Output directory for generated TypeScript types
      config.output_dir = Rails.root.join("app", "frontend", "types", "serializers")

      # Custom types directory (for manually defined types like RegistrationEvent)
      config.custom_types_dir = Rails.root.join("app", "frontend", "types")

      # Transform snake_case keys to camelCase in generated TypeScript
      # This ensures frontend uses idiomatic JavaScript naming (createdAt instead of created_at)
      config.transform_keys = ->(key) { key.to_s.camelize(:lower) }

      # SQL to TypeScript type mapping
      # Map database date/datetime columns to strings (ISO8601 format)
      # Our serializers convert dates to ISO8601 strings via .iso8601 / .to_s
      config.sql_to_typescript_type_mapping.update(
        date: :string,
        datetime: :string,
        time: :string
      )

      # Set fallback type for unmapped SQL types
      config.sql_to_typescript_type_mapping.default = :any

      # Don't use a namespace (export types directly for tree-shaking)
      # This allows: import { Registration } from '@/types/serializers'
      # Instead of: const registration: TypesFromSerializers.Registration
      config.namespace = nil
    end
  end
end
