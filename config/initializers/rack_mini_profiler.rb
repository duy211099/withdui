# frozen_string_literal: true

# Configure rack-mini-profiler for development performance monitoring
# See: https://github.com/MiniProfiler/rack-mini-profiler
if Rails.env.development?
  Rack::MiniProfiler.config.tap do |c|
    # Position the badge in bottom-left corner (won't overlap typical UI elements)
    c.position = "bottom-left"

    # Enable advanced debugging tools (flamegraph, memory profiling)
    c.enable_advanced_debugging_tools = true

    # Use memory store for lightweight development profiling
    c.storage = Rack::MiniProfiler::MemoryStore

    # Show detailed results by default (easier debugging)
    c.collapse_results = false

    # Skip paths that don't need profiling (assets, dev tools)
    c.skip_paths = [
      "/assets/",
      "/vite-dev/",
      "/rails/active_storage/"
    ]

    # Authorization: allow all in development (restrict in staging/production if needed)
    c.authorization_mode = :allow_all
  end
end
