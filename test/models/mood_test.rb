# == Schema Information
#
# Table name: moods
#
#  id         :uuid             not null, primary key
#  entry_date :date             not null
#  level      :integer          not null
#  notes      :text
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :uuid             not null
#
# Indexes
#
#  index_moods_on_entry_date              (entry_date)
#  index_moods_on_level                   (level)
#  index_moods_on_slug                    (slug) UNIQUE
#  index_moods_on_user_id_and_entry_date  (user_id,entry_date) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class MoodTest < ActiveSupport::TestCase
  def setup
    @user = users(:one)
  end

  # Association tests
  test "belongs to user" do
    mood = moods(:one)
    assert_instance_of User, mood.user
  end

  # Validation tests
  test "valid mood with all required attributes" do
    mood = Mood.new(
      user: @user,
      level: 3,
      entry_date: Date.current
    )
    assert mood.valid?
  end

  test "requires level" do
    mood = Mood.new(user: @user, entry_date: Date.current)
    assert_not mood.valid?
    assert_includes mood.errors[:level], "can't be blank"
  end

  test "requires entry_date" do
    mood = Mood.new(user: @user, level: 3)
    assert_not mood.valid?
    assert_includes mood.errors[:entry_date], "can't be blank"
  end

  test "requires level to be integer" do
    mood = Mood.new(user: @user, level: 3.5, entry_date: Date.current)
    assert_not mood.valid?
    assert_includes mood.errors[:level], "must be an integer"
  end

  test "requires level between 1 and 5" do
    [ 0, 6, -1, 10 ].each do |invalid_level|
      mood = Mood.new(user: @user, level: invalid_level, entry_date: 20.days.ago.to_date)
      assert_not mood.valid?, "Level #{invalid_level} should be invalid"
    end

    (1..5).each do |valid_level|
      mood = Mood.new(user: @user, level: valid_level, entry_date: (20 + valid_level).days.ago.to_date)
      assert mood.valid?, "Level #{valid_level} should be valid"
    end
  end

  test "requires unique entry_date per user" do
    mood1 = moods(:one)
    mood2 = Mood.new(
      user: mood1.user,
      level: 3,
      entry_date: mood1.entry_date
    )
    assert_not mood2.valid?
    assert_includes mood2.errors[:entry_date], "already has a mood entry"
  end

  test "allows same entry_date for different users" do
    user2 = users(:two)
    mood1 = moods(:one)
    mood2 = Mood.new(
      user: user2,
      level: 3,
      entry_date: mood1.entry_date
    )
    assert mood2.valid?
  end

  test "prevents future entry_date" do
    mood = Mood.new(
      user: @user,
      level: 3,
      entry_date: 1.day.from_now.to_date
    )
    assert_not mood.valid?
    assert_includes mood.errors[:entry_date], "cannot be in the future"
  end

  test "allows today as entry_date" do
    mood = Mood.new(
      user: @user,
      level: 3,
      entry_date: Date.current
    )
    assert mood.valid?
  end

  test "allows past entry_date" do
    mood = Mood.new(
      user: @user,
      level: 3,
      entry_date: 10.days.ago.to_date
    )
    assert mood.valid?
  end

  test "validates notes length" do
    mood = Mood.new(
      user: @user,
      level: 3,
      entry_date: Date.current,
      notes: "a" * 10_001
    )
    assert_not mood.valid?
    assert_includes mood.errors[:notes], "is too long (maximum is 10000 characters)"
  end

  test "accepts notes up to 10000 characters" do
    mood = Mood.new(
      user: @user,
      level: 3,
      entry_date: Date.current,
      notes: "a" * 10_000
    )
    assert mood.valid?
  end

  # Scope tests
  test "for_user scope filters by user" do
    moods = Mood.for_user(@user)
    assert moods.all? { |mood| mood.user_id == @user.id }
  end

  test "for_month scope filters by month" do
    # Create moods in different months
    mood_jan = @user.moods.create!(level: 4, entry_date: Date.new(2024, 1, 15))
    mood_feb = @user.moods.create!(level: 3, entry_date: Date.new(2024, 2, 15))

    jan_moods = Mood.for_month(2024, 1)
    assert_includes jan_moods, mood_jan
    assert_not_includes jan_moods, mood_feb
  end

  test "for_date_range scope filters by date range" do
    start_date = 5.days.ago.to_date
    end_date = 1.day.ago.to_date

    mood_in_range = @user.moods.create!(level: 4, entry_date: 3.days.ago.to_date)
    mood_out_range = @user.moods.create!(level: 3, entry_date: 10.days.ago.to_date)

    moods = Mood.for_date_range(start_date, end_date)
    assert_includes moods, mood_in_range
    assert_not_includes moods, mood_out_range
  end

  test "by_level scope filters by level" do
    moods_level_4 = Mood.by_level(4)
    assert moods_level_4.all? { |mood| mood.level == 4 }
  end

  test "recent_first scope orders by entry_date descending" do
    moods = Mood.recent_first.limit(2)
    assert moods.first.entry_date >= moods.second.entry_date
  end

  test "oldest_first scope orders by entry_date ascending" do
    moods = Mood.oldest_first.limit(2)
    assert moods.first.entry_date <= moods.second.entry_date
  end

  # Instance method tests
  test "mood_name returns correct name" do
    mood = Mood.new(level: 1)
    assert_equal "terrible", mood.mood_name

    mood.level = 5
    assert_equal "great", mood.mood_name
  end

  test "mood_emoji returns correct emoji" do
    mood = Mood.new(level: 1)
    assert_equal "😢", mood.mood_emoji

    mood.level = 5
    assert_equal "😄", mood.mood_emoji
  end

  test "mood_color returns correct color" do
    mood = Mood.new(level: 1)
    assert_equal "#EF4444", mood.mood_color

    mood.level = 5
    assert_equal "#22C55E", mood.mood_color
  end

  test "serializer returns correct hash structure" do
    mood = moods(:one)
    json = MoodSerializer.one(mood).with_indifferent_access

    assert_equal mood.id, json[:id]
    assert_equal mood.level, json[:level]
    serialized_date = json[:entryDate] || json[:entry_date]
    assert_equal mood.entry_date.to_s, serialized_date.is_a?(String) ? Date.parse(serialized_date).to_s : serialized_date.to_s
    assert_equal mood.notes, json[:notes]
    assert_equal mood.mood_name, json[:moodName] || json[:mood_name]
    assert_equal mood.mood_emoji, json[:moodEmoji] || json[:mood_emoji]
    assert_equal mood.mood_color, json[:moodColor] || json[:mood_color]
    assert_not_nil json[:createdAt] || json[:created_at]
    assert_not_nil json[:updatedAt] || json[:updated_at]
  end

  # Class method tests
  test "mood_config returns correct configuration" do
    config = Mood.mood_config(3)
    assert_equal "okay", config[:name]
    assert_equal "😐", config[:emoji]
    assert_equal "#EAB308", config[:color]
  end

  test "month_summary returns statistics" do
    user = users(:two) # Use different user to avoid conflicts
    year = Date.current.year
    month = Date.current.month

    # Create some moods for the month with unique dates
    user.moods.create!(level: 5, entry_date: Date.current - 5.days)
    user.moods.create!(level: 4, entry_date: Date.current - 6.days)
    user.moods.create!(level: 3, entry_date: Date.current - 7.days)

    summary = Mood.month_summary(user, year, month)

    assert summary[:total_entries] >= 3
    assert_not_nil summary[:average_level]
    assert_kind_of Hash, summary[:level_counts]
    assert summary[:average_level] >= 1
    assert summary[:average_level] <= 5
  end

  # PaperTrail test
  test "has paper_trail enabled" do
    mood = moods(:one)
    assert_respond_to mood, :versions
  end

  test "creates version on update" do
    mood = moods(:one)

    mood.update!(level: 5, notes: "Updated notes")

    # PaperTrail creates versions
    assert mood.versions.count >= 1
  end
end
