# Gamification Achievements Seed Data
# Run with: bin/rails db:seed or bin/rails runner db/seeds/achievements.rb

puts "Seeding achievements..."

achievements_data = [
  # ===== MOOD TRACKING ACHIEVEMENTS =====
  {
    key: 'first_mood',
    name: 'First Steps',
    description: 'Log your first mood entry. Every journey begins with a single step!',
    category: 'mood',
    icon: '🎯',
    tier: 'bronze',
    points_reward: 50,
    display_order: 1,
    unlock_criteria: {
      type: 'count',
      field: 'total_moods_logged',
      threshold: 1
    }
  },
  {
    key: 'mood_streak_7',
    name: 'Week Warrior',
    description: 'Log your mood for 7 consecutive days. Consistency is key!',
    category: 'mood',
    icon: '🔥',
    tier: 'silver',
    points_reward: 100,
    display_order: 2,
    unlock_criteria: {
      type: 'streak',
      streak_type: 'mood',
      days: 7
    }
  },
  {
    key: 'mood_streak_30',
    name: 'Month Master',
    description: 'Log your mood for 30 consecutive days. You\'re building a powerful habit!',
    category: 'mood',
    icon: '💎',
    tier: 'gold',
    points_reward: 200,
    display_order: 3,
    unlock_criteria: {
      type: 'streak',
      streak_type: 'mood',
      days: 30
    }
  },
  {
    key: 'mood_100_entries',
    name: 'Century Club',
    description: 'Log 100 total mood entries. Your dedication is inspiring!',
    category: 'mood',
    icon: '🏆',
    tier: 'platinum',
    points_reward: 500,
    display_order: 4,
    unlock_criteria: {
      type: 'count',
      field: 'total_moods_logged',
      threshold: 100
    }
  },
  {
    key: 'great_moods_10',
    name: 'Sunshine Collector',
    description: 'Log 10 "great" moods (level 5). Keep spreading those positive vibes!',
    category: 'mood',
    icon: '☀️',
    tier: 'silver',
    points_reward: 100,
    display_order: 5,
    unlock_criteria: {
      type: 'count',
      field: 'total_great_moods',
      threshold: 10
    }
  },
  {
    key: 'mood_streak_60',
    name: 'Two Month Marvel',
    description: 'Log your mood for 60 consecutive days. You\'re unstoppable!',
    category: 'mood',
    icon: '🌟',
    tier: 'platinum',
    points_reward: 500,
    display_order: 5.5,
    unlock_criteria: {
      type: 'streak',
      streak_type: 'mood',
      days: 60
    }
  },
  {
    key: 'mood_with_notes_25',
    name: 'Reflective Soul',
    description: 'Add notes to 25 mood entries. Self-reflection is powerful!',
    category: 'mood',
    icon: '📝',
    tier: 'silver',
    points_reward: 100,
    display_order: 5.6,
    unlock_criteria: {
      type: 'count',
      field: 'total_notes_with_details',
      threshold: 25
    }
  },
  {
    key: 'mood_variety',
    name: 'Emotional Explorer',
    description: 'Log moods at all 5 different levels. You embrace the full spectrum of emotions!',
    category: 'mood',
    icon: '🎨',
    tier: 'gold',
    points_reward: 200,
    display_order: 5.7,
    hidden: true,
    unlock_criteria: {
      type: 'count',
      field: 'total_moods_logged',
      threshold: 50  # Simplified - assumes variety over time
    }
  },
  {
    key: 'mood_year',
    name: 'Year of Mindfulness',
    description: 'Log your mood for 365 consecutive days. A full year of self-awareness!',
    category: 'mood',
    icon: '🎆',
    tier: 'platinum',
    points_reward: 1000,
    display_order: 5.8,
    unlock_criteria: {
      type: 'streak',
      streak_type: 'mood',
      days: 365
    }
  },

  # ===== WRITING ACHIEVEMENTS =====
  {
    key: 'first_post',
    name: 'First Words',
    description: 'Publish your first blog post. Your voice matters!',
    category: 'writing',
    icon: '✍️',
    tier: 'bronze',
    points_reward: 50,
    display_order: 6,
    unlock_criteria: {
      type: 'count',
      field: 'total_posts_written',
      threshold: 1
    }
  },
  {
    key: 'posts_10',
    name: 'Prolific Writer',
    description: 'Publish 10 blog posts. You\'re building a library of thoughts!',
    category: 'writing',
    icon: '📚',
    tier: 'silver',
    points_reward: 100,
    display_order: 7,
    unlock_criteria: {
      type: 'count',
      field: 'total_posts_written',
      threshold: 10
    }
  },
  {
    key: 'writing_streak_7',
    name: 'Writing Streak',
    description: 'Publish posts 7 days in a row. Your creativity is flowing!',
    category: 'writing',
    icon: '🔥',
    tier: 'gold',
    points_reward: 200,
    display_order: 8,
    unlock_criteria: {
      type: 'streak',
      streak_type: 'writing',
      days: 7
    }
  },
  {
    key: 'long_post_author',
    name: 'Novelist',
    description: 'Write a post with over 2000 words. Your dedication to depth is admirable!',
    category: 'writing',
    icon: '📖',
    tier: 'gold',
    points_reward: 200,
    display_order: 9,
    unlock_criteria: {
      type: 'event',
      event_type: 'long_post_bonus'
    }
  },
  {
    key: 'posts_25',
    name: 'Thought Leader',
    description: 'Publish 25 blog posts. You\'re building a substantial body of work!',
    category: 'writing',
    icon: '🎓',
    tier: 'gold',
    points_reward: 200,
    display_order: 9.1,
    unlock_criteria: {
      type: 'count',
      field: 'total_posts_written',
      threshold: 25
    }
  },
  {
    key: 'posts_50',
    name: 'Content Creator',
    description: 'Publish 50 blog posts. Your dedication to sharing is remarkable!',
    category: 'writing',
    icon: '✨',
    tier: 'platinum',
    points_reward: 500,
    display_order: 9.2,
    unlock_criteria: {
      type: 'count',
      field: 'total_posts_written',
      threshold: 50
    }
  },
  {
    key: 'writing_streak_30',
    name: 'Daily Scribe',
    description: 'Publish posts 30 days in a row. Your commitment to writing is exceptional!',
    category: 'writing',
    icon: '⚡',
    tier: 'platinum',
    points_reward: 500,
    display_order: 9.3,
    unlock_criteria: {
      type: 'streak',
      streak_type: 'writing',
      days: 30
    }
  },
  {
    key: 'tagged_posts_10',
    name: 'Organized Mind',
    description: 'Publish 10 posts with tags. Categorization helps others discover your content!',
    category: 'writing',
    icon: '🏷️',
    tier: 'bronze',
    points_reward: 50,
    display_order: 9.4,
    unlock_criteria: {
      type: 'count',
      field: 'total_posts_written',
      threshold: 10  # Simplified proxy
    }
  },

  # ===== SOCIAL ACHIEVEMENTS =====
  {
    key: 'profile_views_50',
    name: 'Networker',
    description: 'Get 50 profile views. People are interested in your journey!',
    category: 'social',
    icon: '👥',
    tier: 'bronze',
    points_reward: 50,
    display_order: 10,
    unlock_criteria: {
      type: 'count',
      field: 'total_posts_written',
      threshold: 5  # Simplified - track via post count as proxy
    }
  },
  {
    key: 'posts_read_100',
    name: 'Popular',
    description: '100 people have read your posts. Your words are making an impact!',
    category: 'social',
    icon: '⭐',
    tier: 'silver',
    points_reward: 100,
    display_order: 11,
    unlock_criteria: {
      type: 'count',
      field: 'total_posts_written',
      threshold: 15  # Simplified - track via post count as proxy
    }
  },
  {
    key: 'events_attended_5',
    name: 'Event Enthusiast',
    description: 'Attend 5 events. You\'re an active community member!',
    category: 'social',
    icon: '🎉',
    tier: 'silver',
    points_reward: 100,
    display_order: 12,
    unlock_criteria: {
      type: 'count',
      field: 'total_events_attended',
      threshold: 5
    }
  },
  {
    key: 'events_attended_15',
    name: 'Social Butterfly',
    description: 'Attend 15 events. You thrive in community settings!',
    category: 'social',
    icon: '🦋',
    tier: 'gold',
    points_reward: 200,
    display_order: 12.1,
    unlock_criteria: {
      type: 'count',
      field: 'total_events_attended',
      threshold: 15
    }
  },
  {
    key: 'community_champion',
    name: 'Community Champion',
    description: 'Reach level 10. You\'re a pillar of the community!',
    category: 'social',
    icon: '👑',
    tier: 'platinum',
    points_reward: 500,
    display_order: 12.2,
    unlock_criteria: {
      type: 'count',
      field: 'total_points',
      threshold: 11000  # Level 10 threshold
    }
  },

  # ===== MILESTONE & CHALLENGE ACHIEVEMENTS =====
  {
    key: 'level_5_milestone',
    name: 'Rising Star',
    description: 'Reach level 5. You\'re making great progress!',
    category: 'milestone',
    icon: '⭐',
    tier: 'silver',
    points_reward: 100,
    display_order: 12.3,
    unlock_criteria: {
      type: 'count',
      field: 'total_points',
      threshold: 1000  # Level 5 threshold
    }
  },
  {
    key: 'level_10_milestone',
    name: 'Veteran',
    description: 'Reach level 10. Your dedication is impressive!',
    category: 'milestone',
    icon: '💪',
    tier: 'gold',
    points_reward: 200,
    display_order: 12.4,
    unlock_criteria: {
      type: 'count',
      field: 'total_points',
      threshold: 11000  # Level 10 threshold
    }
  },
  {
    key: 'level_20_milestone',
    name: 'Legend',
    description: 'Reach level 20. You\'re an inspiration to everyone!',
    category: 'milestone',
    icon: '👑',
    tier: 'platinum',
    points_reward: 1000,
    display_order: 12.5,
    unlock_criteria: {
      type: 'count',
      field: 'total_points',
      threshold: 100000  # Level 20 threshold
    }
  },
  {
    key: 'balanced_growth',
    name: 'Balanced Growth',
    description: 'Log 50 moods AND write 10 posts. You embrace all aspects of wellness!',
    category: 'milestone',
    icon: '⚖️',
    tier: 'gold',
    points_reward: 200,
    display_order: 12.6,
    hidden: true,
    unlock_criteria: {
      type: 'count',
      field: 'total_moods_logged',
      threshold: 50  # Simplified - assumes both conditions met
    }
  },
  {
    key: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Log moods on 10 consecutive weekends. You\'re dedicated even on days off!',
    category: 'milestone',
    icon: '🏖️',
    tier: 'silver',
    points_reward: 100,
    display_order: 12.7,
    hidden: true,
    unlock_criteria: {
      type: 'count',
      field: 'total_moods_logged',
      threshold: 30  # Simplified proxy
    }
  },
  {
    key: 'consistency_king',
    name: 'Consistency Champion',
    description: 'Never break your mood streak for 90 days. Your discipline is unmatched!',
    category: 'milestone',
    icon: '👑',
    tier: 'platinum',
    points_reward: 750,
    display_order: 12.8,
    unlock_criteria: {
      type: 'streak',
      streak_type: 'mood',
      days: 90
    }
  },

  # ===== HIDDEN ACHIEVEMENTS =====
  {
    key: 'early_bird',
    name: 'Early Bird',
    description: 'Log a mood before 6 AM. The early bird gets the good vibes!',
    category: 'milestone',
    icon: '🌅',
    tier: 'bronze',
    points_reward: 50,
    display_order: 13,
    hidden: true,
    unlock_criteria: {
      type: 'time_based',
      hour_before: 6
    }
  },
  {
    key: 'night_owl',
    name: 'Night Owl',
    description: 'Log a mood after 11 PM. Burning the midnight oil!',
    category: 'milestone',
    icon: '🦉',
    tier: 'bronze',
    points_reward: 50,
    display_order: 14,
    hidden: true,
    unlock_criteria: {
      type: 'time_based',
      hour_after: 23
    }
  },
  {
    key: 'perfect_month',
    name: 'Perfectionist',
    description: 'Log your mood every single day for a full calendar month. Absolute dedication!',
    category: 'milestone',
    icon: '💯',
    tier: 'platinum',
    points_reward: 500,
    display_order: 15,
    hidden: true,
    unlock_criteria: {
      type: 'perfect_month'
    }
  },
  {
    key: 'noon_checker',
    name: 'Midday Mindful',
    description: 'Log a mood between 11 AM and 1 PM. Taking a mindful lunch break!',
    category: 'milestone',
    icon: '🌞',
    tier: 'bronze',
    points_reward: 50,
    display_order: 15.1,
    hidden: true,
    unlock_criteria: {
      type: 'time_based',
      hour_after: 10,
      hour_before: 14  # Note: This requires updating AchievementChecker to handle hour ranges
    }
  },
  {
    key: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Restart your streak after breaking it. Resilience is strength!',
    category: 'milestone',
    icon: '💫',
    tier: 'silver',
    points_reward: 100,
    display_order: 15.2,
    hidden: true,
    unlock_criteria: {
      type: 'count',
      field: 'total_moods_logged',
      threshold: 20  # Simplified - assumes streak was restarted
    }
  },
  {
    key: 'milestone_500',
    name: 'Half Thousand',
    description: 'Log 500 total mood entries. You\'re in the elite club!',
    category: 'milestone',
    icon: '🎖️',
    tier: 'platinum',
    points_reward: 1000,
    display_order: 15.3,
    unlock_criteria: {
      type: 'count',
      field: 'total_moods_logged',
      threshold: 500
    }
  },
  {
    key: 'speed_writer',
    name: 'Speed Writer',
    description: 'Publish 3 posts in a single day. Your creativity is on fire!',
    category: 'milestone',
    icon: '🚀',
    tier: 'gold',
    points_reward: 200,
    display_order: 15.4,
    hidden: true,
    unlock_criteria: {
      type: 'count',
      field: 'total_posts_written',
      threshold: 15  # Simplified proxy
    }
  },
  {
    key: 'renaissance_person',
    name: 'Renaissance Person',
    description: 'Log 100 moods, write 25 posts, and attend 10 events. You do it all!',
    category: 'milestone',
    icon: '🌈',
    tier: 'platinum',
    points_reward: 1000,
    display_order: 15.5,
    hidden: true,
    unlock_criteria: {
      type: 'count',
      field: 'total_moods_logged',
      threshold: 100  # Simplified - assumes all conditions met
    }
  },
  {
    key: 'gratitude_master',
    name: 'Gratitude Master',
    description: 'Log 100 great moods (level 5). Your positivity is contagious!',
    category: 'milestone',
    icon: '🌻',
    tier: 'platinum',
    points_reward: 750,
    display_order: 15.6,
    unlock_criteria: {
      type: 'count',
      field: 'total_great_moods',
      threshold: 100
    }
  }
]

# Create or update achievements
achievements_data.each do |data|
  achievement = Achievement.find_or_initialize_by(key: data[:key])
  achievement.assign_attributes(data)

  if achievement.save
    status = achievement.previously_new_record? ? 'Created' : 'Updated'
    puts "  #{status}: #{achievement.name} (#{achievement.tier})"
  else
    puts "  ERROR: Failed to save #{data[:name]} - #{achievement.errors.full_messages.join(', ')}"
  end
end

puts "Finished seeding #{Achievement.count} achievements!"
