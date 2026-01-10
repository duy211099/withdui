# Gamification system configuration
# This file defines points, levels, and streak settings for the gamification system

GAMIFICATION_CONFIG = {
  # Points awarded for each action
  points: {
    # Mood Tracking Actions
    mood_logged: 10,                    # Base points for logging a mood
    mood_with_notes: 15,                # Bonus for adding notes to mood
    mood_streak_bonus: 5,               # Per consecutive day bonus
    great_mood_logged: 5,               # Bonus for logging level 5 (great) mood

    # Blog Writing Actions
    post_created: 50,                   # Base points for creating a post
    post_published: 25,                 # Bonus for publishing
    post_with_tags: 10,                 # Bonus for adding tags/categories
    long_post_bonus: 20,                # Bonus for posts > 1000 words

    # Event Actions
    event_attended: 30,                 # Points for attending an event
    event_created: 40,                  # Points for creating an event

    # Social Actions
    profile_view: 2,                    # Points when someone views your profile
    post_read: 5,                       # Points when someone reads your post

    # Achievement Unlocks (bonus points on top of achievement points_reward)
    achievement_unlocked_bronze: 50,
    achievement_unlocked_silver: 100,
    achievement_unlocked_gold: 200,
    achievement_unlocked_platinum: 500
  },

  # Level system configuration
  levels: {
    # Cumulative points needed to reach each level
    # Level 1 = 0 points, Level 2 = 100 points, etc.
    thresholds: [
      0,        # Level 1 (starting level)
      100,      # Level 2
      250,      # Level 3
      500,      # Level 4
      1000,     # Level 5
      2000,     # Level 6
      3500,     # Level 7
      5500,     # Level 8
      8000,     # Level 9
      11000,    # Level 10
      15000,    # Level 11
      20000,    # Level 12
      26000,    # Level 13
      33000,    # Level 14
      41000,    # Level 15
      50000,    # Level 16
      60000,    # Level 17
      72000,    # Level 18
      85000,    # Level 19
      100000,   # Level 20
      120000,   # Level 21
      145000,   # Level 22
      175000,   # Level 23
      210000,   # Level 24
      250000    # Level 25 (max)
    ],
    max_level: 25
  },

  # Streak system configuration
  streaks: {
    mood: {
      milestone_days: [ 7, 14, 30, 60, 100, 365 ],  # Days that trigger milestone achievements
      points_per_day: 5                            # Bonus points awarded per consecutive day
    },
    writing: {
      milestone_days: [ 3, 7, 14, 30 ],             # Days that trigger milestone achievements
      points_per_day: 10                           # Bonus points awarded per consecutive day
    }
  }
}.freeze

# Helper method to calculate required points for next level
def points_for_level(level)
  return 0 if level <= 1

  thresholds = GAMIFICATION_CONFIG[:levels][:thresholds]
  level_index = [ level - 1, thresholds.length - 1 ].min
  thresholds[level_index]
end

# Helper method to calculate level from total points
def level_from_points(total_points)
  thresholds = GAMIFICATION_CONFIG[:levels][:thresholds]

  # Find the highest threshold the user has surpassed
  thresholds.each_with_index do |threshold, index|
    # If we found a threshold higher than current points,
    # the user is at the previous level
    return index if total_points < threshold
  end

  # User has exceeded all thresholds - at max level
  GAMIFICATION_CONFIG[:levels][:max_level]
end
