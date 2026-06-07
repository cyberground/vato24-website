<?php
/**
 * Nova CMS — Konfiguration
 * VaTo24 Website-Assistent
 */

// ============================================================
// CORE
// ============================================================
define('NOVA_VERSION',      '2.0.0');
define('NOVA_SITE_ROOT',    dirname(__DIR__));
define('NOVA_SESSION_NAME', 'nova_cms_session');
define('NOVA_SECRET_KEY',   'vato24-nova-cms-2024-secret-key-x9f');

// Passwort für Nova-Login (bcrypt-Hash)
// Aktuelles Passwort: vato24nova2024!
// Neues Passwort generieren: php -r "echo password_hash('NEUESPASSWORT', PASSWORD_BCRYPT);"
define('NOVA_PASSWORD_HASH', '$2y$12$sf4hhPmGkSVGym1IbMHvz.qEnjaB6mL2nBrXh.rZZXSxvk4UKEORO');

// ============================================================
// CLAUDE RUNNER (kein direkter API-Key!)
// Docs: https://claude-runner.dynomic.ai
// ============================================================
define('RUNNER_URL',    'https://claude-runner.dynomic.ai');
define('RUNNER_TOKEN',  'tF6P7SXc5gX6gEJjX97yYO1ltSp3T8mJ');
define('RUNNER_MODEL',  'claude-sonnet-4-6');
define('RUNNER_TIMEOUT', 30);

// ============================================================
// RATE LIMITING
// ============================================================
define('NOVA_MAX_LOGIN_ATTEMPTS',    5);
define('NOVA_LOGIN_WINDOW_SECONDS',  3600);  // 1 Stunde
define('NOVA_MAX_CHAT_PER_HOUR',    50);     // max. 50 Chat-Nachrichten/Stunde

// ============================================================
// PERMISSIONS — Was darf Nova?
// ============================================================
define('NOVA_PERMISSIONS', json_encode([

    // --------------------------------------------------------
    // SEITEN: Welche Seiten darf Nova bearbeiten?
    // --------------------------------------------------------
    'allowed_pages' => [
        'index.html'            => 'Startseite',
        'leistungen/index.html' => 'Leistungen',
        'marken/index.html'     => 'Marken & Projekte',
        'prozess/index.html'    => 'Prozess',
        'kontakt/index.html'    => 'Kontakt',
        'projekte/index.html'   => 'Projekte',
    ],

    // --------------------------------------------------------
    // GESPERRTE SEITEN: Diese darf Nova NICHT bearbeiten
    // --------------------------------------------------------
    'blocked_pages' => [
        'impressum/index.html',
        'datenschutz/index.html',
        'agb/index.html',
        'nova/login.html',
    ],

    // --------------------------------------------------------
    // CHANGE TYPES: Welche Arten von Änderungen sind erlaubt?
    // --------------------------------------------------------
    'allowed_change_types' => [
        'text',   // Reiner Textinhalt
        'html',   // HTML mit Whitelist-Tags
        'href',   // Link-URLs
        'src',    // Bild-URLs
    ],
    // Deaktiviert: 'class' (CSS-Klassen nicht per Nova ändern)

    // --------------------------------------------------------
    // ELEMENT-IDs: Welche data-nova-id darf Nova bearbeiten?
    // Leer = alle erlaubt (Ausnahme: blocked_nova_ids greift immer)
    // --------------------------------------------------------
    'allowed_nova_ids' => [],

    // --------------------------------------------------------
    // GESPERRTE ELEMENT-IDs: Diese darf Nova NIE ändern
    // --------------------------------------------------------
    'blocked_nova_ids' => [
        'nav-logo',
        'site-header',
        'site-footer',
        'nova-panel',
    ],

    // --------------------------------------------------------
    // INHALTS-LIMITS
    // --------------------------------------------------------
    'max_content_length'  => 2000,   // max. Zeichen pro Änderung
    'max_html_nesting'    => 3,      // max. HTML-Tiefe bei html-changeType
    'allowed_html_tags'   => ['p', 'strong', 'em', 'a', 'br', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'span'],

    // --------------------------------------------------------
    // BILD-UPLOAD
    // --------------------------------------------------------
    'image_upload' => [
        'enabled'       => true,
        'max_size_mb'   => 10,
        'allowed_types' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        'output_sizes'  => [1920, 1280, 800, 400],
        'output_format' => 'webp',
        'webp_quality'  => 85,
        'upload_dir'    => 'images/uploaded',
    ],

    // --------------------------------------------------------
    // NOVA PERSONA
    // --------------------------------------------------------
    'persona' => [
        'name'     => 'Nova',
        'role'     => 'Website-Assistent von VaTo24',
        'language' => 'de',
        'tone'     => 'professionell, freundlich, kurz und klar',
        'brand'    => 'VaTo24 – Marketingagentur, Unna, NRW',
    ],

    // --------------------------------------------------------
    // VERBOTENE THEMEN (Nova lehnt diese Anfragen ab)
    // --------------------------------------------------------
    'blocked_topics' => [
        'Preise nennen oder Angebote erstellen',
        'Rechtliche Texte (Impressum, AGB, Datenschutz) ändern',
        'Passwörter oder Zugangsdaten einbauen',
        'Externe Scripts oder Tracking-Codes hinzufügen',
        'Wettbewerber-Namen in positivem Kontext erwähnen',
    ],

    // --------------------------------------------------------
    // LOGGING
    // --------------------------------------------------------
    'log_changes'    => true,
    'log_file'       => 'changelog.json',
    'log_max_entries' => 500,
]));
