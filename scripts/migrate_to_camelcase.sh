#!/bin/bash
# Script to migrate React components from snake_case to camelCase field names
# This updates components to match auto-generated serializer types

set -e

echo "🔄 Migrating React components to use camelCase field names..."

# User fields
find app/frontend -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/\.avatar_url/.avatarUrl/g' \
  -e 's/\.created_at/.createdAt/g' \
  -e 's/\.updated_at/.updatedAt/g' \
  {} \;

# UserStats fields
find app/frontend -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/\.total_points/.totalPoints/g' \
  -e 's/\.current_level/.currentLevel/g' \
  -e 's/\.points_to_next_level/.pointsToNextLevel/g' \
  -e 's/\.level_progress/.levelProgress/g' \
  -e 's/\.current_mood_streak/.currentMoodStreak/g' \
  -e 's/\.longest_mood_streak/.longestMoodStreak/g' \
  -e 's/\.current_writing_streak/.currentWritingStreak/g' \
  -e 's/\.longest_writing_streak/.longestWritingStreak/g' \
  -e 's/\.total_moods_logged/.totalMoodsLogged/g' \
  -e 's/\.total_posts_written/.totalPostsWritten/g' \
  -e 's/\.total_events_attended/.totalEventsAttended/g' \
  -e 's/\.total_great_moods/.totalGreatMoods/g' \
  -e 's/\.total_notes_with_details/.totalNotesWithDetails/g' \
  {} \;

# Mood fields
find app/frontend -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/\.entry_date/.entryDate/g' \
  -e 's/\.mood_emoji/.moodEmoji/g' \
  -e 's/\.mood_color/.moodColor/g' \
  -e 's/\.mood_name/.moodName/g' \
  {} \;

echo "✅ Migration complete! Running TypeScript check..."

npm run check
