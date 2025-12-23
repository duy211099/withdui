# rake js:routes

namespace :js do
  desc "Generate JavaScript routes from Rails routes"
  task routes: :environment do
    output_file = Rails.root.join("app/frontend/lib/routes.ts")

    # Ensure the directory exists
    FileUtils.mkdir_p(File.dirname(output_file))

    # Generate the routes file
    File.write(output_file, JsRoutes.generate)

    puts "Routes generated at #{output_file}"
  end
end
