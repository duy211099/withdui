# frozen_string_literal: true

module Life
  class WeeksController < ApplicationController
    before_action :authenticate_user!
    before_action :check_birth_date, only: [ :show ]

    # GET /life/weeks
    # Main Life in Weeks visualization page
    def show
      service = LifeWeeksService.new(current_user)
      data = service.generate_life_weeks_data

      # Load user's existing week entries
      week_entries = current_user.life_week_entries
                                  .with_notes
                                  .ordered_by_week

      render inertia: "life/Weeks", props: {
        life_weeks_data: data,
        week_entries: LifeWeekEntrySerializer.many(week_entries),
        can_edit: true
      }
    end

    # PATCH/PUT /life/weeks/:week_number
    # Update or create notes for a specific week
    def update
      week_number = params[:week_number].to_i

      # Validate week number
      unless (0..4159).include?(week_number)
        return render json: { error: "Invalid week number" }, status: :unprocessable_entity
      end

      # Find or initialize entry
      entry = current_user.life_week_entries.find_or_initialize_by(week_number: week_number)

      if entry.update(entry_params)
        render json: {
          success: true,
          entry: LifeWeekEntrySerializer.one(entry)
        }
      else
        render json: {
          error: entry.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
      end
    end

    # DELETE /life/weeks/:week_number
    # Delete notes for a specific week
    def destroy
      week_number = params[:week_number].to_i
      entry = current_user.life_week_entries.find_by(week_number: week_number)

      if entry&.destroy
        render json: { success: true }
      else
        render json: { error: "Entry not found" }, status: :not_found
      end
    end

    private

    def check_birth_date
      return if current_user.birth_date

      redirect_to root_path,
                  alert: I18n.t("frontend.life_weeks.errors.birth_date_required")
    end

    def entry_params
      params.permit(:notes, :memories)
    end
  end
end
