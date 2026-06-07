<?php
// Nova CMS Configuration
// TODO: Move to parent directory of webroot for production
define('NOVA_VERSION', '1.0.0');
define('NOVA_SITE_ROOT', dirname(__DIR__)); // Points to vite dist root
define('NOVA_PASSWORD_HASH', '$2y$12$placeholder.replace.this.with.real.hash.generated.by.script'); // Change this!
define('NOVA_SESSION_NAME', 'nova_cms_session');
define('NOVA_SECRET_KEY', 'change-this-to-random-32-char-string-NOW');

// Anthropic Claude API
define('CLAUDE_API_KEY', getenv('ANTHROPIC_API_KEY') ?: '');
define('CLAUDE_MODEL', 'claude-sonnet-4-6');

// GitHub API for committing changes (optional)
define('GITHUB_PAT', getenv('GITHUB_PAT') ?: '');
define('GITHUB_REPO', 'cyberground/vato24-website');
define('GITHUB_BRANCH', 'gh-pages');

// Pages that Nova can edit (relative to site root)
define('NOVA_EDITABLE_PAGES', json_encode([
  'index.html'              => 'Startseite',
  'leistungen/index.html'   => 'Leistungen',
  'marken/index.html'       => 'Marken & Projekte',
  'prozess/index.html'      => 'Prozess',
  'kontakt/index.html'      => 'Kontakt',
  'projekte/index.html'     => 'Projekte',
]));

// Rate limiting settings
define('NOVA_MAX_LOGIN_ATTEMPTS', 5);
define('NOVA_LOGIN_WINDOW_SECONDS', 3600); // 1 hour

// Allowed HTML tags for 'html' changeType (simple whitelist)
define('NOVA_ALLOWED_HTML_TAGS', '<p><strong><em><a><br><ul><ol><li><h2><h3><h4><span>');
