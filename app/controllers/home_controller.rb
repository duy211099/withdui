class HomeController < ApplicationController
  def index
    # Fetch published blog posts for graph view
    posts = BlogPost.published.map(&:to_json_hash)

    # If user is logged in, fetch their mood data for current month
    if current_user
      # Parse year/month from params, default to current month
      year = params[:year]&.to_i || Date.today.year
      month = params[:month]&.to_i || Date.today.month

      # Get all moods for the month (combined view)
      moods = Mood.for_month(year, month).includes(:user)

      render inertia: "Home", props: {
        posts: posts,
        moods: moods.map { |m| m.to_json_hash.merge(user: m.user.as_json(only: [ :id, :name, :email, :avatar_url ])) },
        year: year,
        month: month,
        mood_levels: Mood::MOOD_LEVELS
      }
    else
      render inertia: "Home", props: {
        posts: posts
      }
    end
  end
end
