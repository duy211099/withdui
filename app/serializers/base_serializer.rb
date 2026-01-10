# frozen_string_literal: true

# BaseSerializer - All serializers in the app should extend this class
#
# Includes TypesFromSerializers::DSL when available (development), but
# gracefully skips it in environments where the gem isn't loaded (e.g. production).
begin
  require "types_from_serializers"
rescue LoadError
  # Gem not available; skip TS generation DSL in this environment
end

class BaseSerializer < Oj::Serializer
  include TypesFromSerializers::DSL if defined?(TypesFromSerializers::DSL)
end
