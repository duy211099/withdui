class Rack::Attack
  # Block requests to common vulnerability scanner paths
  # These paths don't exist in Rails apps and indicate automated attacks
  blocklist("block_scanners") do |req|
    # WordPress, PHP, and CMS scanner patterns
    wordpress_patterns = %w[
      /wp-admin /wp-login.php /xmlrpc.php /wp-content /wp-includes
      /wordpress /wp-config.php /wp-json /phpmyadmin /admin.php
    ]

    # Common vulnerability scanner paths
    scanner_patterns = %w[
      /.env /config.php /shell.php /c99.php /r57.php
      /phpinfo.php /backup.sql /database.sql /.git/config
      /adminer.php /setup.php /install.php /config.json
    ]

    # File upload exploits
    upload_patterns = %w[
      /upload.php /uploads.php /uploader.php /uploadify.php
    ]

    all_patterns = wordpress_patterns + scanner_patterns + upload_patterns

    # Block if path matches any pattern
    all_patterns.any? { |pattern| req.path.include?(pattern) }
  end

  # Block requests with suspicious file extensions
  blocklist("block_bad_extensions") do |req|
    suspicious_extensions = %w[.php .asp .aspx .cgi .pl .py .sh .exe]
    suspicious_extensions.any? { |ext| req.path.end_with?(ext) }
  end

  # Block known bad user agents (adjust list as needed)
  blocklist("block_bad_agents") do |req|
    bad_agents = [
      "masscan", "nikto", "nmap", "sqlmap", "dirbuster",
      "acunetix", "nessus", "openvas", "w3af"
    ]
    user_agent = req.user_agent.to_s.downcase
    bad_agents.any? { |agent| user_agent.include?(agent) }
  end

  # Rate limiting
  throttle("req/ip", limit: 300, period: 5.minutes) do |req|
    req.ip unless req.path.start_with?("/assets", "/vite")
  end

  throttle("logins/ip", limit: 5, period: 20.seconds) do |req|
    if req.path == "/users/sign_in" && req.post?
      req.ip
    end
  end

  # Custom response for blocked requests
  self.blocklisted_responder = lambda do |_env|
    [ 403, { "Content-Type" => "text/plain" }, [ "Forbidden\n" ] ]
  end
end
