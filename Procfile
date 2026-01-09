# Production Procfile - runs web server and Solid Queue jobs worker
# Use with: foreman start -f Procfile (or your production process manager)

web: bundle exec puma -C config/puma.rb
jobs: bundle exec rake solid_queue:start
