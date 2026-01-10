#!/bin/bash
set -e

echo "🔄 Rolling back to flat structure..."

# Move files back to flat structure
mv app/serializers/users/serializer.rb app/serializers/user_serializer.rb
mv app/serializers/users/basic_serializer.rb app/serializers/user_basic_serializer.rb
mv app/serializers/users/detailed_serializer.rb app/serializers/user_detailed_serializer.rb
mv app/serializers/users/minimal_serializer.rb app/serializers/user_minimal_serializer.rb
mv app/serializers/users/stats_serializer.rb app/serializers/user_stats_serializer.rb
mv app/serializers/moods/serializer.rb app/serializers/mood_serializer.rb
mv app/serializers/events/serializer.rb app/serializers/event_serializer.rb
mv app/serializers/registrations/serializer.rb app/serializers/registration_serializer.rb
mv app/serializers/registrations/form_serializer.rb app/serializers/registration_form_serializer.rb

# Remove empty folders
rmdir app/serializers/{users,moods,events,registrations}

# Revert class names
sed -i '' 's/class Users::Serializer/class UserSerializer/' app/serializers/user_serializer.rb
sed -i '' 's/class Users::BasicSerializer/class UserBasicSerializer/' app/serializers/user_basic_serializer.rb
sed -i '' 's/class Users::DetailedSerializer/class UserDetailedSerializer/' app/serializers/user_detailed_serializer.rb
sed -i '' 's/class Users::MinimalSerializer/class UserMinimalSerializer/' app/serializers/user_minimal_serializer.rb
sed -i '' 's/class Users::StatsSerializer/class UserStatsSerializer/' app/serializers/user_stats_serializer.rb
sed -i '' 's/class Moods::Serializer/class MoodSerializer/' app/serializers/mood_serializer.rb
sed -i '' 's/class Events::Serializer/class EventSerializer/' app/serializers/event_serializer.rb
sed -i '' 's/class Registrations::Serializer/class RegistrationSerializer/' app/serializers/registration_serializer.rb
sed -i '' 's/class Registrations::FormSerializer/class RegistrationFormSerializer/' app/serializers/registration_form_serializer.rb

# Revert serializer references
sed -i '' 's/Users::MinimalSerializer/UserMinimalSerializer/g' app/serializers/mood_serializer.rb
sed -i '' 's/Events::Serializer/EventSerializer/g' app/serializers/registration_serializer.rb

echo "✅ Rolled back successfully!"
