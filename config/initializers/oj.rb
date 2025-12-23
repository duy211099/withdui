# Configure Oj as the default JSON backend for Rails
# This makes all JSON operations (as_json, to_json, jbuilder) use Oj for better performance

require "oj"

# Use Oj for JSON encoding/decoding
Oj.optimize_rails

# Configure Oj mode
# :rails mode is compatible with ActiveSupport::JSON and handles Rails objects properly
Oj.default_options = {
  mode: :rails,
  time_format: :ruby,
  use_to_json: true
}
