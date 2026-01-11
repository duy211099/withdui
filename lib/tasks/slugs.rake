namespace :slugs do
  desc "Generate slugs for existing records"
  task backfill: :environment do
    puts "Backfilling slugs..."

    # Update Users
    puts "\nUpdating Users..."
    User.where(slug: nil).find_each do |user|
      user.send(:generate_slug)
      if user.save(validate: false)
        puts "  ✓ User #{user.id} (#{user.email}) -> #{user.slug}"
      else
        puts "  ✗ Failed to update User #{user.id}: #{user.errors.full_messages.join(', ')}"
      end
    end

    # Update Moods
    puts "\nUpdating Moods..."
    Mood.where(slug: nil).find_each do |mood|
      mood.send(:generate_slug)
      if mood.save(validate: false)
        puts "  ✓ Mood #{mood.id} (#{mood.entry_date}) -> #{mood.slug}"
      else
        puts "  ✗ Failed to update Mood #{mood.id}: #{mood.errors.full_messages.join(', ')}"
      end
    end

    # Update Events
    puts "\nUpdating Events..."
    Event.where(slug: nil).find_each do |event|
      event.send(:generate_slug)
      if event.save(validate: false)
        puts "  ✓ Event #{event.id} (#{event.name}) -> #{event.slug}"
      else
        puts "  ✗ Failed to update Event #{event.id}: #{event.errors.full_messages.join(', ')}"
      end
    end

    puts "\n✅ Slug backfill completed!"
  end
end
