# frozen_string_literal: true

# BaseSerializer - All serializers in the app should extend this class
#
# Includes TypesFromSerializers::DSL to enable automatic TypeScript type generation
# from serializer definitions.
class BaseSerializer < Oj::Serializer
  include TypesFromSerializers::DSL
end
