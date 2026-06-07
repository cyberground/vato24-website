<?php
/**
 * Nova CMS — Permissions API
 * Gibt dem Frontend die aktuellen Berechtigungen zurück
 *
 * GET  → {permissions: {...}, session: bool}
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

session_name(NOVA_SESSION_NAME);
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => isset($_SERVER['HTTPS']), 'httponly' => true, 'samesite' => 'Strict']);
session_start();

$authenticated = !empty($_SESSION['nova_authenticated']);

if (!$authenticated) {
    http_response_code(200);
    echo json_encode(['authenticated' => false, 'permissions' => null], JSON_UNESCAPED_UNICODE);
    exit;
}

// Frische CSRF-Token generieren / erneuern
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$perms = json_decode(NOVA_PERMISSIONS, true);

// Sicherheitsrelevante Felder NICHT ans Frontend senden
$publicPerms = [
    'allowed_pages'       => $perms['allowed_pages'] ?? [],
    'blocked_pages'       => $perms['blocked_pages'] ?? [],
    'allowed_change_types' => $perms['allowed_change_types'] ?? [],
    'blocked_nova_ids'    => $perms['blocked_nova_ids'] ?? [],
    'allowed_nova_ids'    => $perms['allowed_nova_ids'] ?? [],
    'max_content_length'  => $perms['max_content_length'] ?? 2000,
    'image_upload'        => [
        'enabled'     => $perms['image_upload']['enabled'] ?? false,
        'max_size_mb' => $perms['image_upload']['max_size_mb'] ?? 10,
    ],
    'persona' => [
        'name' => $perms['persona']['name'] ?? 'Nova',
        'role' => $perms['persona']['role'] ?? '',
    ],
    'blocked_topics' => $perms['blocked_topics'] ?? [],
];

echo json_encode([
    'authenticated' => true,
    'csrf_token'    => $_SESSION['csrf_token'],
    'nova_version'  => NOVA_VERSION,
    'permissions'   => $publicPerms,
], JSON_UNESCAPED_UNICODE);
