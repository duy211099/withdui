# frozen_string_literal: true

class AboutController < ApplicationController
  def index
    render inertia: "About"
  end
end
