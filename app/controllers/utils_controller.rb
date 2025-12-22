class UtilsController < ApplicationController
  def index
    render inertia: "utils/Index"
  end
end
