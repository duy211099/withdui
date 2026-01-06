# frozen_string_literal: true

module InertiaPropsSerializer
  module_function

  def call(props)
    Oj.load(Oj.dump(props, mode: :rails), symbol_keys: true)
  end
end
