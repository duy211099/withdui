# frozen_string_literal: true

class InertiaExampleController < ApplicationController
  def index
    render inertia: "InertiaExample", props: {
      name: params.fetch(:name, "World")
    }
  end

  def hello
    render inertia: "v1/Hello"
  end
end
