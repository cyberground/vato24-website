<?php
/**
 * Nova CMS — Apply Content Change Endpoint
 *
 * POST JSON: {page, novaId, changeType, newContent, element}
 * Returns:   {success: true, preview: string} | {success: false, error: string}
 */

require_once __DIR__ . '/config.php';

// ---- Headers ----------------------------------------------------------------
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function json_out(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// ---- Session auth check -----------------------------------------------------
session_name(NOVA_SESSION_NAME);
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'secure'   => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

if (empty($_SESSION['nova_authenticated'])) {
    json_out(['success' => false, 'error' => 'Nicht authentifiziert.'], 401);
}

// ---- CSRF check -------------------------------------------------------------
$csrfHeader = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (empty($csrfHeader) || empty($_SESSION['nova_csrf']) || !hash_equals($_SESSION['nova_csrf'], $csrfHeader)) {
    json_out(['success' => false, 'error' => 'Ungültiges CSRF-Token.'], 403);
}

// ---- Parse request body -----------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['success' => false, 'error' => 'Nur POST erlaubt.'], 405);
}

$body = file_get_contents('php://input');
$data = json_decode($body, true);

if (!is_array($data)) {
    json_out(['success' => false, 'error' => 'Ungültiger JSON-Body.'], 400);
}

$page       = $data['page']       ?? '';
$novaId     = $data['novaId']     ?? '';
$changeType = $data['changeType'] ?? '';
$newContent = $data['newContent'] ?? '';
$element    = $data['element']    ?? [];

// ---- Validate inputs --------------------------------------------------------
$allowedPages   = json_decode(NOVA_EDITABLE_PAGES, true);
$allowedChanges = ['text', 'href', 'src', 'class', 'html'];

if (!array_key_exists($page, $allowedPages)) {
    json_out(['success' => false, 'error' => 'Seite nicht erlaubt: ' . htmlspecialchars($page)], 400);
}

if (empty($novaId) || !preg_match('/^[a-zA-Z0-9_\-]+$/', $novaId)) {
    json_out(['success' => false, 'error' => 'Ungültige Nova-ID.'], 400);
}

if (!in_array($changeType, $allowedChanges, true)) {
    json_out(['success' => false, 'error' => 'Ungültiger changeType: ' . htmlspecialchars($changeType)], 400);
}

// ---- Resolve file path ------------------------------------------------------
$filePath = NOVA_SITE_ROOT . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $page);

// Prevent path traversal
$realSiteRoot = realpath(NOVA_SITE_ROOT);
$realFilePath = realpath($filePath);

if ($realFilePath === false || strpos($realFilePath, $realSiteRoot) !== 0) {
    json_out(['success' => false, 'error' => 'Ungültiger Dateipfad.'], 403);
}

if (!file_exists($realFilePath) || !is_readable($realFilePath)) {
    json_out(['success' => false, 'error' => 'Datei nicht gefunden: ' . htmlspecialchars($page)], 404);
}

if (!is_writable($realFilePath)) {
    json_out(['success' => false, 'error' => 'Datei nicht beschreibbar. Bitte Dateiberechtigungen prüfen.'], 500);
}

// ---- Load HTML with DOMDocument ---------------------------------------------
$htmlContent = file_get_contents($realFilePath);

// Preserve HTML entities and charset
libxml_use_internal_errors(true);
$dom = new DOMDocument('1.0', 'UTF-8');
// Wrap in charset meta to help DOMDocument handle UTF-8 correctly
$dom->loadHTML('<?xml encoding="UTF-8">' . $htmlContent, LIBXML_NOWARNING | LIBXML_NOERROR);
libxml_clear_errors();

$xpath = new DOMXPath($dom);
$nodes = $xpath->query('//*[@data-nova-id="' . addslashes($novaId) . '"]');

if ($nodes === false || $nodes->length === 0) {
    json_out(['success' => false, 'error' => 'Element nicht gefunden: data-nova-id="' . htmlspecialchars($novaId) . '"'], 404);
}

$node = $nodes->item(0);

// ---- Apply change -----------------------------------------------------------
$preview = '';

switch ($changeType) {
    case 'text':
        // Clear existing text nodes, set new text content
        while ($node->firstChild) {
            $node->removeChild($node->firstChild);
        }
        $node->appendChild($dom->createTextNode($newContent));
        $preview = mb_substr($newContent, 0, 100);
        break;

    case 'html':
        // Strip to allowed tags only
        $sanitized = strip_tags($newContent, NOVA_ALLOWED_HTML_TAGS);

        // Parse fragment and replace node contents
        while ($node->firstChild) {
            $node->removeChild($node->firstChild);
        }

        $fragment = $dom->createDocumentFragment();
        // Use DOMDocument to safely parse the HTML fragment
        $tempDom = new DOMDocument();
        libxml_use_internal_errors(true);
        $tempDom->loadHTML('<?xml encoding="UTF-8"><body>' . $sanitized . '</body>', LIBXML_NOWARNING | LIBXML_NOERROR);
        libxml_clear_errors();

        $bodyNode = $tempDom->getElementsByTagName('body')->item(0);
        foreach ($bodyNode->childNodes as $child) {
            $imported = $dom->importNode($child, true);
            $fragment->appendChild($imported);
        }
        $node->appendChild($fragment);
        $preview = mb_substr(strip_tags($sanitized), 0, 100);
        break;

    case 'href':
        // Validate URL loosely
        $url = filter_var($newContent, FILTER_SANITIZE_URL);
        $node->setAttribute('href', $url);
        $preview = mb_substr($url, 0, 100);
        break;

    case 'src':
        $url = filter_var($newContent, FILTER_SANITIZE_URL);
        $node->setAttribute('src', $url);
        $preview = mb_substr($url, 0, 100);
        break;

    case 'class':
        $classes = preg_replace('/[^a-zA-Z0-9\s_\-]/', '', $newContent);
        $node->setAttribute('class', $classes);
        $preview = mb_substr($classes, 0, 100);
        break;
}

// ---- Serialize back to HTML -------------------------------------------------
// Get only the <html> content, strip the wrapper DOMDocument adds
$newHtml = $dom->saveHTML();

// Remove the XML declaration we injected and any added doctype quirks by
// restoring the original doctype if present
if (preg_match('/<!DOCTYPE[^>]*>/i', $htmlContent, $dtMatch)) {
    // Remove whatever doctype saveHTML added and restore original
    $newHtml = preg_replace('/<!DOCTYPE[^>]*>\s*/i', $dtMatch[0] . "\n", $newHtml, 1);
}
// Remove the <?xml encoding="UTF-8"> we injected (saveHTML strips it but be safe)
$newHtml = preg_replace('/<\?xml encoding="UTF-8"\?>\s*/i', '', $newHtml);

// ---- Write to disk ----------------------------------------------------------
$written = file_put_contents($realFilePath, $newHtml, LOCK_EX);
if ($written === false) {
    json_out(['success' => false, 'error' => 'Fehler beim Speichern der Datei.'], 500);
}

// ---- Append to changelog ----------------------------------------------------
$changelogFile = __DIR__ . '/changelog.json';
$changelog     = [];

if (file_exists($changelogFile)) {
    $existing  = file_get_contents($changelogFile);
    $parsed    = json_decode($existing, true);
    $changelog = is_array($parsed) ? $parsed : [];
}

$logEntry = [
    'ts'         => date('c'),
    'page'       => $page,
    'novaId'     => $novaId,
    'changeType' => $changeType,
    'preview'    => $preview,
    'element'    => is_array($element) ? $element : [],
    'ip'         => substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 45),
];

$changelog[] = $logEntry;

// Keep last 500 entries
if (count($changelog) > 500) {
    $changelog = array_slice($changelog, -500);
}

file_put_contents($changelogFile, json_encode($changelog, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

json_out(['success' => true, 'preview' => $preview]);
