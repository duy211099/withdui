class MoodsController < ApplicationController
  # Require authentication for create/update/delete only (index is public)
  before_action :authenticate_user!, except: [ :index ]
  before_action :set_mood, only: [ :edit, :update, :destroy ]

  # GET /moods
  # Calendar view with month navigation (public - anyone can view)
  def index
    # Parse year/month from params, default to current month
    @year = params[:year]&.to_i || Date.today.year
    @month = params[:month]&.to_i || Date.today.month

    # Get moods based on user_id filter (or all users if no filter)
    if params[:user_id].present?
      # Filter by specific user
      user = User.find(params[:user_id])
      moods = user.moods.for_month(@year, @month)
      summary = Mood.month_summary(user, @year, @month)
      viewing_user = user
    else
      # Show all users' moods (combined view)
      moods = Mood.for_month(@year, @month).includes(:user)
      summary = {
        total_entries: moods.count,
        average_level: moods.average(:level)&.round(1),
        level_counts: moods.group(:level).count,
        best_day: moods.order(level: :desc).first&.entry_date,
        worst_day: moods.order(level: :asc).first&.entry_date
      }
      viewing_user = nil
    end

    # Get all users for the filter dropdown
    all_users = User.select(:id, :name, :email).order(:name, :email)

    render inertia: "moods/Index", props: {
      moods: moods.map { |m| m.to_json_hash.merge(user: m.user.as_json(only: [ :id, :name, :email, :avatar_url ])) },
      year: @year,
      month: @month,
      summary: summary,
      mood_levels: Mood::MOOD_LEVELS,
      all_users: all_users.as_json(only: [ :id, :name, :email ]),
      viewing_user_id: viewing_user&.id,
      can_edit: current_user.present?
    }
  end

  # GET /moods/new?date=2024-01-15
  # Form to create new mood entry
  def new
    # Parse date from params or default to today
    date = params[:date] ? Date.parse(params[:date]) : Date.today

    # Check if mood already exists for this date
    existing_mood = current_user.moods.find_by(entry_date: date)

    if existing_mood
      redirect_to edit_mood_path(existing_mood),
                  notice: "Mood entry already exists for #{date.strftime('%B %d, %Y')}. You can edit it here."
      return
    end

    render inertia: "moods/New", props: {
      date: date.to_s,
      mood_levels: Mood::MOOD_LEVELS
    }
  end

  # POST /moods
  def create
    mood = current_user.moods.build(mood_params)

    if mood.save
      # === GAMIFICATION HOOKS ===
      gamify_mood_creation(mood)
      # === END GAMIFICATION ===

      redirect_to moods_path(
        year: mood.entry_date.year,
        month: mood.entry_date.month
      ), notice: "Mood entry saved successfully!"
    else
      # Re-render with errors
      redirect_to new_mood_path(date: mood_params[:entry_date]),
                  alert: mood.errors.full_messages.join(", ")
    end
  end

  # GET /moods/:id/edit
  def edit
    authorize! @mood, to: :edit?

    render inertia: "moods/Edit", props: {
      mood: @mood.to_json_hash,
      mood_levels: Mood::MOOD_LEVELS
    }
  end

  # PATCH /moods/:id
  def update
    authorize! @mood, to: :update?

    if @mood.update(mood_params)
      redirect_to moods_path(
        year: @mood.entry_date.year,
        month: @mood.entry_date.month
      ), notice: "Mood entry updated!"
    else
      redirect_to edit_mood_path(@mood),
                  alert: @mood.errors.full_messages.join(", ")
    end
  end

  # DELETE /moods/:id
  def destroy
    authorize! @mood, to: :destroy?

    entry_date = @mood.entry_date
    @mood.destroy

    redirect_to moods_path(
      year: entry_date.year,
      month: entry_date.month
    ), notice: "Mood entry deleted."
  end

  private

  def set_mood
    @mood = Mood.find(params[:id])
  end

  def mood_params
    params.permit(:level, :entry_date, :notes)
  end

  # Gamification logic for mood creation
  def gamify_mood_creation(mood)
    # Award base points for logging mood
    current_user.award_points(:mood_logged, source: mood)

    # Award bonus points for adding notes
    current_user.award_points(:mood_with_notes, source: mood) if mood.notes.present?

    # Award bonus points for "great" mood (level 5)
    current_user.award_points(:great_mood_logged, source: mood) if mood.level == 5

    # Check for time-based achievements
    current_user.award_points(:mood_logged, source: mood, metadata: { time: Time.current })

    # Update mood streak
    current_user.update_mood_streak(mood.entry_date)

    # Update activity counters
    current_user.user_stat.increment!(:total_moods_logged)
    current_user.user_stat.increment!(:total_great_moods) if mood.level == 5
    current_user.user_stat.increment!(:total_notes_with_details) if mood.notes.present?
  end
end
