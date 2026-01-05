# ___________________________________________________________
# Strings

# puts "Ruby is friendly!"

# phrase = "I am sleepy"
# puts phrase

# city = "Dalat"
# rank = "the best"
# puts "I'm in #{city}\nMy hometown is #{rank}!"
# ___________________________________________________________

# ___________________________________________________________
# Methods

# def emojis(emoji, number)
#   emoji * number
# end

# def movie_info(title = "None", rank = 1)
#   stars = emojis("⭐️", rank)
#   "#{title} has a rank of #{stars}"
# end

# def movie_info_2(title: "Hi", rank: 9)
#   stars = emojis("🌝", rank)
#   "#{title} has a rank of #{stars}"
# end

# movie="dui"
# rank=3

# puts movie_info
# puts movie_info("Goonies", 10)
# puts movie_info(movie, rank)

# puts movie_info_2
# puts movie_info_2(title: "Goonies", rank: 10)
# puts movie_info_2(rank: rank, title: movie)
# ___________________________________________________________

# ___________________________________________________________
# Classes & Attributes
class Movie
  attr_accessor :title
  attr_reader :rank

  def initialize(title, rank = 5)
    @title=title
    @rank=rank
  end

  def to_s = "#{@title} has a rank of #{@rank}"

  def like
    @rank += 1
  end

  def unlike
    @rank -= 1
  end
end


movie = Movie.new("Dui", 10)
# puts movie
movie.like
# puts movie
# puts movie.title
movie.title = "DUI NEWW"
# puts movie.title
# puts movie.rank

movie2 = Movie.new("Dui2", 21)
# puts movie2
movie2.unlike
# puts movie2

movie2 = Movie.new("Dui3")
# puts movie2
# ___________________________________________________________

# ___________________________________________________________
# Symbols
_symbols_is_not_string = "title" != :title


# ___________________________________________________________
# Conditions

if true
  # ...
elsif false
  # ...
else
  # ...
end

case
when true
  # ...
when 1..2
  # ...
else
  # ...
end

# ___________________________________________________________
# Array
seats = [ "kermit", "fozzie", "gonzo" ]
seats[0]
seats[1]
seats[2]
seats[3]
seats[10] = "hi"
seats.size
seats.empty?
seats.append("hello")
seats.pop
seats.shift
seats.compact
seats.compact!
seats.sample

movies = [ movie, movie2 ]

# puts "\nBefore watching:"
# puts movies

movies.each do |movie|
  movie.like
  # puts movie
end

# ___________________________________________________________
# Self

# ___________________________________________________________
# Block
9.times do |num|
  # puts num
end

# ___________________________________________________________
# Struct

Snack = Struct.new(:name, :price)

popcorn = Snack.new("popcorn", 3)
Snack.new("candy", 1)

puts popcorn.name

# ___________________________________________________________
# Struct

# ___________________________________________________________
# Module

# ___________________________________________________________
# Hash
snacks = { popcorn: 3, candy: 1 }
# snacks = { "popcorn"=>3, "candy"=>1 }
snacks["popcorn"]
snacks[:nacho] = 5
snacks.empty?
snacks.size
snacks.has_key?("popcorn")
snacks.keys
snacks.values
puts snacks
snacks.each { |name, price| puts "#{name}: #{price}" }


# ___________________________________________________________
# Enumerable
# .each
# .select
# .reject
# .partition
# .map
# .sort_by

# ___________________________________________________________
# Exceptions
def hi
  begin
    # ...
  rescue => e
    put e.message
  end
end

# ___________________________________________________________
# Rich Inheritance
#
