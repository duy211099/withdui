class HomeController < ApplicationController
  def index
    # Fetch published note posts for graph view
    posts = NotePost.published.map(&:to_json_hash)

    # If user is logged in, fetch their mood data for current month
    # Parse year/month from params, default to current month
    year = params[:year]&.to_i || Date.today.year
    month = params[:month]&.to_i || Date.today.month

    # Get all moods for the month (combined view)
    moods = Mood.for_month(year, month).includes(:user)

    render inertia: "Home", props: {
      posts: posts,
      moods: MoodSerializer.many(moods),
      year: year,
      month: month,
      mood_levels: Mood::MOOD_LEVELS
    }
  end

  def random
    if rand < 0.5
      render json: { message: "Random fetch failed" }, status: :internal_server_error
      return
    end

    render json: { value: SecureRandom.hex(4), generated_at: Time.current.iso8601 }
  end
end
