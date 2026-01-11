# == Schema Information
#
# Table name: users
#
#  id                     :uuid             not null, primary key
#  avatar_url             :string
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  name                   :string
#  provider               :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  role                   :string           default("user"), not null
#  slug                   :string
#  uid                    :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
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

  # Role-based authorization (string enum)
  attribute :role, :string, default: "user"
  enum :role, { user: "user", admin: "admin" }

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
