# Serializer Folder Organization Migration

## Folder Structure

```
app/serializers/
├── base_serializer.rb           # Keep at root
├── README.md                     # Keep at root
├── users/                        # User-related serializers
│   ├── serializer.rb            # (was user_serializer.rb)
│   ├── basic_serializer.rb      # (was user_basic_serializer.rb)
│   ├── detailed_serializer.rb   # (was user_detailed_serializer.rb)
│   ├── minimal_serializer.rb    # (was user_minimal_serializer.rb)
│   └── stats_serializer.rb      # (was user_stats_serializer.rb)
├── moods/
│   └── serializer.rb            # (was mood_serializer.rb)
├── events/
│   └── serializer.rb            # (was event_serializer.rb)
└── registrations/
    ├── serializer.rb            # (was registration_serializer.rb)
    └── form_serializer.rb       # (was registration_form_serializer.rb)
```

## TODO(human): Migration Steps

### 1. Create Folders
```bash
mkdir -p app/serializers/{users,moods,events,registrations}
```

### 2. Move and Rename Files

#### Users
```bash
# Main user serializer
mv app/serializers/user_serializer.rb app/serializers/users/serializer.rb

# User variants
mv app/serializers/user_basic_serializer.rb app/serializers/users/basic_serializer.rb
mv app/serializers/user_detailed_serializer.rb app/serializers/users/detailed_serializer.rb
mv app/serializers/user_minimal_serializer.rb app/serializers/users/minimal_serializer.rb
mv app/serializers/user_stats_serializer.rb app/serializers/users/stats_serializer.rb
```

#### Moods
```bash
mv app/serializers/mood_serializer.rb app/serializers/moods/serializer.rb
```

#### Events
```bash
mv app/serializers/event_serializer.rb app/serializers/events/serializer.rb
```

#### Registrations
```bash
mv app/serializers/registration_serializer.rb app/serializers/registrations/serializer.rb
mv app/serializers/registration_form_serializer.rb app/serializers/registrations/form_serializer.rb
```

### 3. Update Class Names (Add Module Namespacing)

After moving files, update the class definitions:

#### app/serializers/users/serializer.rb
```ruby
# Change from:
class UserSerializer < BaseSerializer

# To:
class Users::Serializer < BaseSerializer
```

#### app/serializers/users/basic_serializer.rb
```ruby
# Change from:
class UserBasicSerializer < BaseSerializer

# To:
class Users::BasicSerializer < BaseSerializer
```

**Repeat for all moved serializers**, following this pattern:
- `UserDetailedSerializer` → `Users::DetailedSerializer`
- `UserMinimalSerializer` → `Users::MinimalSerializer`
- `UserStatsSerializer` → `Users::StatsSerializer`
- `MoodSerializer` → `Moods::Serializer`
- `EventSerializer` → `Events::Serializer`
- `RegistrationSerializer` → `Registrations::Serializer`
- `RegistrationFormSerializer` → `Registrations::FormSerializer`

### 4. Update Serializer References in Code

Search and replace in your codebase:

```ruby
# Controllers
UserSerializer → Users::Serializer
UserBasicSerializer → Users::BasicSerializer
UserDetailedSerializer → Users::DetailedSerializer
UserMinimalSerializer → Users::MinimalSerializer
UserStatsSerializer → Users::StatsSerializer
MoodSerializer → Moods::Serializer
EventSerializer → Events::Serializer
RegistrationSerializer → Registrations::Serializer
RegistrationFormSerializer → Registrations::FormSerializer
```

**Files to check:**
- `app/controllers/**/*.rb`
- `app/serializers/**/*.rb` (nested serializers that reference others)

### 5. Verify

After moving and updating:
```bash
# Regenerate types
bundle exec rake types_from_serializers:generate

# Check TypeScript
npm run check

# Check Ruby syntax
rubocop app/serializers

# Test in Rails console
rails c
Users::Serializer.one(User.first)
```

## Why This Structure?

1. **Scalability**: Easy to find serializers as the app grows
2. **Clarity**: Related serializers are grouped together
3. **Rails Convention**: Follows same pattern as controllers
4. **Shorter Names**: `Users::BasicSerializer` vs `UserBasicSerializer`
5. **Namespace Benefits**: Avoids naming conflicts

## Example Usage After Migration

```ruby
# Before
UserBasicSerializer.one(user)
RegistrationFormSerializer.many(registrations)

# After
Users::BasicSerializer.one(user)
Registrations::FormSerializer.many(registrations)
```

## TypeScript Types (No Change!)

The generated TypeScript types will remain the same:
- `UserBasic` (not `Users::Basic` - the gem handles this)
- `RegistrationForm`
- etc.

The folder structure is purely for Ruby organization. TypeScript output is unchanged!
