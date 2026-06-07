<?php
/**
 * Nova CMS — Authentication Endpoint
 * GET  → {authenticated: bool, csrfToken: string|null}
 * POST → login (password) | logout (action=logout)
 */

require_once __DIR__ . '/config.php';

// ---- Response helpers -------------------------------------------------------
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Content-Type-Options: nosniff');

function json_out(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// ---- Session setup ----------------------------------------------------------
session_name(NOVA_SESSION_NAME);
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'secure'   => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

// ---- Rate limiting ----------------------------------------------------------
$rateLimitFile = sys_get_temp_dir() . '/nova_ratelimit.json';

function getRateLimitData(): array {
    global $rateLimitFile;
    if (!file_exists($rateLimitFile)) return [];
    $data = json_decode(file_get_contents($rateLimitFile), true);
    return is_array($data) ? $data : [];
}

function saveRateLimitData(array $data): void {
    global $rateLimitFile;
    file_put_contents($rateLimitFile, json_encode($data), LOCK_EX);
}

function checkRateLimit(string $ip): bool {
    $data    = getRateLimitData();
    $now     = time();
    $window  = NOVA_LOGIN_WINDOW_SECONDS;
    $maxTries = NOVA_MAX_LOGIN_ATTEMPTS;

    // Clean old entries
    $data = array_filter($data, fn($entry) => ($now - $entry['ts']) < $window);

    $attempts = array_filter($data, fn($entry) => $entry['ip'] === $ip);
    return count($attempts) < $maxTries;
}

function recordFailedAttempt(string $ip): void {
    $data   = getRateLimitData();
    $now    = time();
    $window = NOVA_LOGIN_WINDOW_SECONDS;

    // Clean old entries for this IP
    $data = array_values(array_filter($data, fn($entry) => ($now - $entry['ts']) < $window));
    $data[] = ['ip' => $ip, 'ts' => $now];
    saveRateLimitData($data);
}

// ---- CSRF helpers -----------------------------------------------------------
function generateCsrfToken(): string {
    if (empty($_SESSION['nova_csrf'])) {
        $_SESSION['nova_csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['nova_csrf'];
}

function validateCsrfToken(string $token): bool {
    return !empty($_SESSION['nova_csrf']) && hash_equals($_SESSION['nova_csrf'], $token);
}

// ---- Handle GET -------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $authenticated = !empty($_SESSION['nova_authenticated']) && $_SESSION['nova_authenticated'] === true;
    $csrfToken     = $authenticated ? generateCsrfToken() : null;
    json_out(['authenticated' => $authenticated, 'csrfToken' => $csrfToken]);
}

// ---- Handle POST ------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Logout
    $body   = file_get_contents('php://input');
    $params = [];
    parse_str($body, $params);

    // Also check form-encoded from URLSearchParams
    if (!empty($params['action']) && $params['action'] === 'logout') {
        session_destroy();
        json_out(['success' => true, 'message' => 'Abgemeldet.']);
    }

    // Also support JSON body for logout
    $json = json_decode($body, true);
    if (is_array($json) && !empty($json['action']) && $json['action'] === 'logout') {
        session_destroy();
        json_out(['success' => true, 'message' => 'Abgemeldet.']);
    }

    // Login — check rate limit
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $ip = explode(',', $ip)[0];
    $ip = trim($ip);

    if (!checkRateLimit($ip)) {
        json_out(['success' => false, 'error' => 'Zu viele Versuche. Bitte warte eine Stunde.'], 429);
    }

    // Extract password from form-data or JSON
    $password = $params['password'] ?? ($json['password'] ?? '');

    if (empty($password)) {
        json_out(['success' => false, 'error' => 'Kein Passwort angegeben.'], 400);
    }

    if (password_verify($password, NOVA_PASSWORD_HASH)) {
        // Regenerate session ID to prevent fixation
        session_regenerate_id(true);
        $_SESSION['nova_authenticated'] = true;
        $_SESSION['nova_login_time']    = time();
        $_SESSION['nova_ip']            = $ip;

        $csrfToken = generateCsrfToken();
        json_out(['success' => true, 'csrfToken' => $csrfToken]);
    } else {
        recordFailedAttempt($ip);
        // Generic error — don't leak whether password or user is wrong
        json_out(['success' => false, 'error' => 'Falsches Passwort.'], 401);
    }
}

// Fallback
json_out(['error' => 'Ungültige Anfrage.'], 405);
