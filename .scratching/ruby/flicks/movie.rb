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
