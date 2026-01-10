#!/bin/bash
# Script to organize serializers into folders by domain

set -e

echo "🗂️  Organizing serializers into folders..."

# Create folder structure
mkdir -p app/serializers/{users,moods,events,registrations}

# Move and rename user serializers
echo "Moving user serializers..."
mv app/serializers/user_serializer.rb app/serializers/users/serializer.rb
mv app/serializers/user_basic_serializer.rb app/serializers/users/basic_serializer.rb
mv app/serializers/user_detailed_serializer.rb app/serializers/users/detailed_serializer.rb
mv app/serializers/user_minimal_serializer.rb app/serializers/users/minimal_serializer.rb
mv app/serializers/user_stats_serializer.rb app/serializers/users/stats_serializer.rb

# Move mood serializers
echo "Moving mood serializers..."
mv app/serializers/mood_serializer.rb app/serializers/moods/serializer.rb

# Move event serializers
echo "Moving event serializers..."
mv app/serializers/event_serializer.rb app/serializers/events/serializer.rb

# Move registration serializers
echo "Moving registration serializers..."
mv app/serializers/registration_serializer.rb app/serializers/registrations/serializer.rb
mv app/serializers/registration_form_serializer.rb app/serializers/registrations/form_serializer.rb

echo "✅ Files moved successfully!"

# Update class names to use module namespacing
echo "Updating class names with module namespacing..."

# Users
sed -i '' 's/class UserSerializer/class Users::Serializer/' app/serializers/users/serializer.rb
sed -i '' 's/class UserBasicSerializer/class Users::BasicSerializer/' app/serializers/users/basic_serializer.rb
sed -i '' 's/class UserDetailedSerializer/class Users::DetailedSerializer/' app/serializers/users/detailed_serializer.rb
sed -i '' 's/class UserMinimalSerializer/class Users::MinimalSerializer/' app/serializers/users/minimal_serializer.rb
sed -i '' 's/class UserStatsSerializer/class Users::StatsSerializer/' app/serializers/users/stats_serializer.rb

# Moods
sed -i '' 's/class MoodSerializer/class Moods::Serializer/' app/serializers/moods/serializer.rb

# Events
sed -i '' 's/class EventSerializer/class Events::Serializer/' app/serializers/events/serializer.rb

# Registrations
sed -i '' 's/class RegistrationSerializer/class Registrations::Serializer/' app/serializers/registrations/serializer.rb
sed -i '' 's/class RegistrationFormSerializer/class Registrations::FormSerializer/' app/serializers/registrations/form_serializer.rb

echo "✅ Class names updated!"

# Update references in serializers (nested serializer calls)
echo "Updating serializer references..."

# Update UserMinimalSerializer → Users::MinimalSerializer in moods/serializer.rb
sed -i '' 's/UserMinimalSerializer/Users::MinimalSerializer/g' app/serializers/moods/serializer.rb

# Update EventSerializer → Events::Serializer in registrations/serializer.rb
sed -i '' 's/EventSerializer/Events::Serializer/g' app/serializers/registrations/serializer.rb

echo "✅ Serializer references updated!"

echo "🎉 Migration complete!"
echo ""
echo "Next steps:"
echo "1. Update controller references (will be done automatically)"
echo "2. Regenerate TypeScript types"
echo "3. Verify everything works"
