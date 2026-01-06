# frozen_string_literal: true

cookie_domain =
  if Rails.env.production?
    ENV["COOKIE_DOMAIN"] || :all
  else
    ENV["COOKIE_DOMAIN"] || ".lvh.me"
  end

cookie_tld_length =
  if Rails.env.production?
    ENV["COOKIE_TLD_LENGTH"]&.to_i
  else
    nil
  end

session_options = { key: "_withdui_session", domain: cookie_domain }
session_options[:tld_length] = cookie_tld_length if cookie_tld_length

Rails.application.config.session_store(:cookie_store, **session_options)
