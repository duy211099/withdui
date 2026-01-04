# puts "Ruby is friendly!"

# phrase = "I am sleepy"
# puts phrase

# city = "Dalat"
# rank = "the best"
# puts "I'm in #{city}\nMy hometown is #{rank}!"

def emojis(emoji, number)
  emoji * number
end

def movie_info(title = "None", rank = 1)
  stars = emojis("⭐️", rank)
  "#{title} has a rank of #{stars}"
end

def movie_info_2(title: "Hi", rank: 9)
  stars = emojis("🌝", rank)
  "#{title} has a rank of #{stars}"
end

movie="dui"
rank=3

puts movie_info
puts movie_info("Goonies", 10)
puts movie_info(movie, rank)

puts movie_info_2
puts movie_info_2(title: "Goonies", rank: 10)
puts movie_info_2(rank: rank, title: movie)
