# frozen_string_literal: true

# Service class for Life in Weeks calculations
# Handles week-to-stage mapping, color blending, and mood aggregation
class LifeWeeksService
  # Erikson's psychosocial development stages mapped to weeks
  # Based on: https://en.wikipedia.org/wiki/Erikson%27s_stages_of_psychosocial_development
  LIFE_STAGES = {
    childhood: {
      name: "Childhood",
      age_range: { min: 0, max: 12 },
      week_range: { min: 0, max: 623 },     # 0-12 years = 624 weeks
      color: "#60A5FA",                      # blue-400 (sky blue - innocence, learning)
      description: "Foundation years: Trust, autonomy, initiative, and industry"
    },
    adolescence: {
      name: "Adolescence",
      age_range: { min: 12, max: 18 },
      week_range: { min: 624, max: 935 },    # 12-18 years = 312 weeks
      color: "#A78BFA",                       # violet-400 (purple - transformation)
      description: "Identity formation: Who am I? Peer relationships and independence"
    },
    young_adult: {
      name: "Young Adulthood",
      age_range: { min: 18, max: 40 },
      week_range: { min: 936, max: 2079 },   # 18-40 years = 1144 weeks
      color: "#34D399",                       # emerald-400 (green - growth, vitality)
      description: "Intimacy and career: Building relationships and establishing career"
    },
    middle_adult: {
      name: "Middle Adulthood",
      age_range: { min: 40, max: 65 },
      week_range: { min: 2080, max: 3379 },  # 40-65 years = 1300 weeks
      color: "#FBBF24",                       # amber-400 (gold - wisdom, productivity)
      description: "Generativity: Contributing to society, mentoring next generation"
    },
    late_adult: {
      name: "Late Adulthood",
      age_range: { min: 65, max: 80 },
      week_range: { min: 3380, max: 4159 },  # 65-80 years = 780 weeks
      color: "#F472B6",                       # pink-400 (warm pink - reflection, legacy)
      description: "Integrity: Life reflection, wisdom sharing, and legacy building"
    }
  }.freeze

  attr_reader :user

  def initialize(user)
    @user = user
  end

  # Generate complete dataset for Life in Weeks grid
  # @return [Hash] Complete data structure for frontend
  def generate_life_weeks_data
    return error_response("Birth date not set") unless user.birth_date

    {
      user: user_info,
      weeks: generate_weeks_array,
      statistics: calculate_statistics,
      life_stages: LIFE_STAGES,
      mood_data: aggregate_mood_data
    }
  end

  # Class method: Map week number to life stage
  # @param week_number [Integer] Week number (0-4159)
  # @return [Symbol] Life stage key
  def self.week_to_life_stage(week_number)
    LIFE_STAGES.each do |stage_key, stage_data|
      return stage_key if (stage_data[:week_range][:min]..stage_data[:week_range][:max]).include?(week_number)
    end
    :late_adult # Default fallback
  end

  # Class method: Get life stage color
  # @param stage_key [Symbol] Life stage key
  # @return [String] Hex color code
  def self.stage_color(stage_key)
    LIFE_STAGES.dig(stage_key, :color) || "#9CA3AF" # gray-400 fallback
  end

  private

  def user_info
    {
      birth_date: user.birth_date,
      age_in_years: user.age_in_years,
      weeks_lived: user.weeks_lived
    }
  end

  # Generate array of 4160 week objects
  # Performance: ~40ms for 4160 iterations
  def generate_weeks_array
    weeks_lived = user.weeks_lived || 0
    life_week_entries = user.life_week_entries.index_by(&:week_number)

    (0..4159).map do |week_num|
      is_lived = week_num < weeks_lived
      stage = self.class.week_to_life_stage(week_num)
      entry = life_week_entries[week_num]

      {
        week_number: week_num,
        year: week_num / 52,
        week_of_year: (week_num % 52) + 1,
        is_lived: is_lived,
        life_stage: stage,
        stage_color: self.class.stage_color(stage),
        has_notes: entry&.notes.present?,
        date_range: calculate_date_range(week_num)
      }
    end
  end

  # Calculate date range for a specific week
  def calculate_date_range(week_num)
    start_date = user.birth_date + (week_num * 7).days
    end_date = start_date + 6.days

    {
      start_date: start_date.iso8601,
      end_date: end_date.iso8601,
      formatted: "#{start_date.strftime('%b %d')} - #{end_date.strftime('%b %d, %Y')}"
    }
  end

  # Aggregate mood data by week
  # Performance optimization: Single query with group_by in memory
  def aggregate_mood_data
    weeks_lived = user.weeks_lived || 0
    return {} if weeks_lived.zero?

    # Query all moods since birth date
    moods = user.moods
                .where("entry_date >= ?", user.birth_date)
                .order(:entry_date)
                .pluck(:entry_date, :level)

    # Group moods by week number
    moods_by_week = moods.each_with_object(Hash.new { |h, k| h[k] = [] }) do |(date, level), hash|
      week_num = ((date - user.birth_date).to_i / 7).floor
      hash[week_num] << { level: level, date: date.iso8601 }
    end

    # Calculate aggregates for each week with moods
    moods_by_week.transform_values do |week_moods|
      {
        count: week_moods.size,
        average_level: (week_moods.sum { |m| m[:level] }.to_f / week_moods.size).round(2),
        mood_entries: week_moods,
        sparkline_data: week_moods.map { |m| m[:level] }
      }
    end
  end

  # Calculate statistics for display cards
  def calculate_statistics
    weeks_lived = user.weeks_lived || 0
    life_percentage = user.life_percentage || 0
    weeks_remaining = [ 4160 - weeks_lived, 0 ].max

    # Peak years: 25-44 (young adult prime)
    peak_start_week = 25 * 52  # Week 1300
    peak_end_week = 44 * 52    # Week 2288
    current_age = user.age_in_years || 0

    if current_age < 25
      peak_weeks_remaining = peak_end_week - peak_start_week + 1
    elsif current_age >= 25 && current_age < 44
      peak_weeks_remaining = peak_end_week - weeks_lived
    else
      peak_weeks_remaining = 0
    end

    {
      weeks_lived: weeks_lived,
      weeks_remaining: weeks_remaining,
      life_percentage: life_percentage,
      age_in_years: current_age,
      peak_weeks_remaining: [ peak_weeks_remaining, 0 ].max,
      peak_age_range: "25-44"
    }
  end

  def error_response(message)
    {
      error: message,
      user: user_info,
      weeks: [],
      statistics: {},
      life_stages: LIFE_STAGES,
      mood_data: {}
    }
  end
end
