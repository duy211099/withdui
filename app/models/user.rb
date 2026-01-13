# == Schema Information
#
# Table name: users
#
#  id                                                                               :uuid             not null, primary key
#  avatar_url                                                                       :string
#  birth_date(User birth date for Life in Weeks visualization and age calculations) :date
#  email                                                                            :string           default(""), not null
#  encrypted_password                                                               :string           default(""), not null
#  name                                                                             :string
#  provider                                                                         :string
#  remember_created_at                                                              :datetime
#  reset_password_sent_at                                                           :datetime
#  reset_password_token                                                             :string
#  role                                                                             :string           default("user"), not null
#  slug                                                                             :string
#  uid                                                                              :string
#  created_at                                                                       :datetime         not null
#  updated_at                                                                       :datetime         not null
#
# Indexes
#
#  index_users_on_birth_date            (birth_date)
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_provider_and_uid      (provider,uid) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_role                  (role)
#  index_users_on_slug                  (slug) UNIQUE
#
class User < ApplicationRecord
  # Enable PaperTrail for audit logging
  has_paper_trail

  include PgSearch::Model

  # Include gamification functionality
  include Gamifiable

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [ :google_oauth2 ]

  # Associations
  has_many :moods, dependent: :destroy
  has_many :registrations, dependent: :destroy
  has_many :life_week_entries, dependent: :destroy
  has_many :greetings, dependent: :destroy

  # Role-based authorization (string enum)
  attribute :role, :string, default: "user"
  enum :role, { user: "user", admin: "admin" }

  # Validations
  validates :birth_date, allow_nil: true, comparison: {
    less_than_or_equal_to: -> { Date.current },
    message: "cannot be in the future"
  }

  # Slug generation
  before_validation :generate_slug, on: :create

  pg_search_scope :search_by_keyword,
                  against: { name: "A", email: "B" },
                  using: {
                    tsearch: {
                      prefix: true,
                      normalization: 2
                    }
                  }

  def to_param
    slug
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.name = auth.info.name
      user.avatar_url = auth.info.image
    end
  end

  # Calculate user's age in years
  # @return [Integer, nil] Age in years or nil if birth_date not set
  def age_in_years
    return nil unless birth_date

    today = Date.current
    age = today.year - birth_date.year
    age -= 1 if today < birth_date + age.years
    age
  end

  # Calculate total weeks lived since birth
  # @return [Integer, nil] Weeks lived or nil if birth_date not set
  def weeks_lived
    return nil unless birth_date

    ((Date.current - birth_date).to_i / 7).floor
  end

  # Calculate percentage of 80-year life lived
  # @return [Float, nil] Percentage (0-100+) or nil if birth_date not set
  def life_percentage
    return nil unless birth_date

    (weeks_lived.to_f / 4160 * 100).round(2)
  end

  private

  def generate_slug
    return if slug.present?
    return unless email.present?

    base_slug = (name.presence || email.split("@").first).parameterize
    candidate_slug = base_slug
    counter = 1

    while User.exists?(slug: candidate_slug)
      candidate_slug = "#{base_slug}-#{counter}"
      counter += 1
    end

    self.slug = candidate_slug
  end
end
