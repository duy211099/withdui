# frozen_string_literal: true

# Auto-annotate models and routes after migrations
# Only runs in development environment

if Rails.env.development?
  require "annotate_rb"

  # Hook into Rails migration tasks to auto-annotate
  task :annotate_models do
    puts "Annotating models..."
    system("bundle exec annotaterb models")
  end

  task :annotate_routes do
    puts "Annotating routes..."
    system("bundle exec annotaterb routes")
  end

  # Run after db:migrate
  Rake::Task["db:migrate"].enhance do
    Rake::Task["annotate_models"].invoke
  end

  # Run after db:rollback
  Rake::Task["db:rollback"].enhance do
    Rake::Task["annotate_models"].invoke
  end

  # Run after routes are loaded (when routes change)
  # Note: This won't auto-detect route changes, run manually with: rake annotate_routes
end
