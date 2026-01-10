# Controller for gamification dashboard and leaderboard
class GamificationController < ApplicationController
  before_action :authenticate_user!

  # GET /gamification/dashboard
  # Main gamification dashboard showing user stats, achievements, and progress
  def dashboard
    @stats = current_user.user_stat

    # Get unlocked achievements with full achievement details
    @unlocked_achievements = current_user.user_achievements
      .includes(:achievement)
      .order(unlocked_at: :desc)

    # Get available achievements (not yet unlocked)
    unlocked_ids = @unlocked_achievements.map(&:achievement_id)
    @available_achievements = Achievement.visible
      .where.not(id: unlocked_ids)
      .ordered

    # Get recent gamification events
    @recent_events = current_user.gamification_events.recent.limit(20)

    render inertia: "gamification/Dashboard", props: {
      stats: @stats ? UserStatsSerializer.one(@stats) : default_stats,
      unlocked_achievements: @unlocked_achievements.map(&:to_json_hash),
      available_achievements: @available_achievements.map(&:to_json_hash),
      recent_events: @recent_events.map(&:to_json_hash)
    }
  end

  # GET /gamification/leaderboard
  # Optional leaderboard for social comparison
  # Note: This is opt-in for personal growth focus
  def leaderboard
    # Get top users by total points
    @top_users = UserStat.includes(:user)
      .order(total_points: :desc)
      .limit(50)

    # Calculate current user's rank
    @current_user_rank = calculate_user_rank(current_user)
    @current_user_stats = current_user.user_stat

    render inertia: "gamification/Leaderboard", props: {
      leaderboard: @top_users.map do |stat|
        {
          user: stat.user.as_json(only: [ :id, :name, :email, :avatar_url ]),
          stats: UserStatsSerializer.one(stat)
        }
      end,
      current_user_rank: @current_user_rank,
      current_user_stats: @current_user_stats ? UserStatsSerializer.one(@current_user_stats) : nil
    }
  end

  private

  # Calculate user's rank based on total points
  def calculate_user_rank(user)
    return nil unless user.user_stat

    UserStat.where("total_points > ?", user.user_stat.total_points).count + 1
  end

  # Default stats for users without user_stat record
  def default_stats
    {
      totalPoints: 0,
      currentLevel: 1,
      pointsToNextLevel: 100,
      levelProgress: 0,
      currentMoodStreak: 0,
      longestMoodStreak: 0,
      currentWritingStreak: 0,
      longestWritingStreak: 0,
      totalMoodsLogged: 0,
      totalPostsWritten: 0,
      totalEventsAttended: 0,
      totalGreatMoods: 0,
      totalNotesWithDetails: 0
    }
  end
end
