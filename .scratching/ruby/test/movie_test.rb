require "minitest/autorun"
require_relative "../flicks/movie"

class MovieTest < Minitest::Spec
  def test_has_a_capitalized_title
        movie = Movie.new("Hi", 3)

        assert_equal "Hi", movie.title
  end

  def test_has_an_initial_rank
        movie = Movie.new("Hi", 3)

        assert_equal 3, movie.rank
  end
end
