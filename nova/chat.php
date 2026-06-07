<?php
/**
 * Nova CMS — Chat Endpoint
 * Nutzt Claude Runner statt direktem API-Key
 *
 * POST JSON: {message, context: {novaId, page, currentContent, elementType}}
 * Returns:   {message, applyData: null|{changeType, newContent}}
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function json_out(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// ---- Session-Auth -----------------------------------------------------------
session_name(NOVA_SESSION_NAME);
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => isset($_SERVER['HTTPS']), 'httponly' => true, 'samesite' => 'Strict']);
session_start();

if (empty($_SESSION['nova_authenticated'])) {
    json_out(['success' => false, 'error' => 'Nicht authentifiziert.'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Nur POST erlaubt.'], 405);
}

// ---- Rate Limiting (Chat) --------------------------------------------------
$chatRateFile = sys_get_temp_dir() . '/nova_chat_' . md5($_SERVER['REMOTE_ADDR'] ?? 'unknown') . '.json';
$now = time();
$chatLog = [];
if (file_exists($chatRateFile)) {
    $chatLog = json_decode(file_get_contents($chatRateFile), true) ?: [];
}
$chatLog = array_filter($chatLog, fn($t) => $t > $now - 3600);
if (count($chatLog) >= NOVA_MAX_CHAT_PER_HOUR) {
    json_out(['message' => 'Stundenlimit erreicht (max. ' . NOVA_MAX_CHAT_PER_HOUR . ' Nachrichten/Stunde). Bitte warten.', 'applyData' => null], 429);
}
$chatLog[] = $now;
file_put_contents($chatRateFile, json_encode(array_values($chatLog)));

// ---- Request parsen --------------------------------------------------------
$body = file_get_contents('php://input');
$data = json_decode($body, true);

if (!is_array($data)) {
    json_out(['error' => 'Ungültiger JSON-Body.'], 400);
}

$userMessage = trim($data['message'] ?? '');
$context     = is_array($data['context']) ? $data['context'] : [];

if (empty($userMessage)) {
    json_out(['error' => 'Nachricht darf nicht leer sein.'], 400);
}

// ---- Permissions laden -----------------------------------------------------
$permissions = json_decode(NOVA_PERMISSIONS, true);

$novaId         = $context['novaId']         ?? '';
$pageName       = $context['page']           ?? '';
$elementType    = $context['elementType']    ?? '';
$currentContent = mb_substr($context['currentContent'] ?? '', 0, 500);

// Seite gesperrt?
if (!empty($pageName) && in_array($pageName, $permissions['blocked_pages'] ?? [])) {
    json_out(['message' => 'Diese Seite ist gesperrt und kann nicht bearbeitet werden. (Rechtliche Seiten sind schreibgeschützt)', 'applyData' => null], 403);
}

// Seite erlaubt?
$allowedPages = $permissions['allowed_pages'] ?? [];
if (!empty($pageName) && !empty($allowedPages) && !array_key_exists($pageName, $allowedPages)) {
    json_out(['message' => 'Diese Seite ist für Nova-Bearbeitung nicht freigegeben.', 'applyData' => null], 403);
}

// Element gesperrt?
if (!empty($novaId) && in_array($novaId, $permissions['blocked_nova_ids'] ?? [])) {
    json_out(['message' => "Das Element '{$novaId}' ist schreibgeschützt und kann nicht geändert werden.", 'applyData' => null], 403);
}

// ---- System-Prompt aufbauen (inkl. Permissions) ----------------------------
$persona   = $permissions['persona'] ?? [];
$allowedCT = implode(', ', $permissions['allowed_change_types'] ?? ['text', 'html', 'href']);
$blockedTopics = implode("\n- ", $permissions['blocked_topics'] ?? []);
$maxLen    = $permissions['max_content_length'] ?? 2000;
$allowedHtmlTags = implode(', ', $permissions['allowed_html_tags'] ?? []);

$novaIdDisplay      = htmlspecialchars($novaId ?: 'keines ausgewählt');
$pageDisplay        = htmlspecialchars($pageName ?: 'Unbekannte Seite');
$elementTypeDisplay = htmlspecialchars($elementType ?: 'unbekannt');

$systemPrompt = <<<SYSTEM
Du bist {$persona['name']}, {$persona['role']}.
Ton: {$persona['tone']}.
Marke: {$persona['brand']}.

## Aktuell ausgewähltes Element
- Element-ID (data-nova-id): {$novaIdDisplay}
- Seite: {$pageDisplay}
- Typ: {$elementTypeDisplay}
- Aktueller Inhalt: {$currentContent}

## Deine Aufgabe
Wenn der Benutzer eine Änderung beschreibt:
1. Fasse in 1-2 Sätzen zusammen, was du verstanden hast
2. Zeige den neuen Inhalt als Code-Block
3. Frage: "Soll ich diese Änderung übernehmen? [Ja / Nein]"

Wenn der Benutzer mit "Ja" bestätigt, antworte mit:
NOVA_APPLY:{"changeType":"text","newContent":"...neuer Inhalt..."}

Erlaubte changeTypes: {$allowedCT}
Bei "html": nur diese Tags erlaubt: {$allowedHtmlTags}
Max. Inhaltslänge: {$maxLen} Zeichen

## Verbotene Themen (diese Anfragen lehnst du höflich ab)
- {$blockedTopics}

## Stil-Regeln
- Antworte immer auf Deutsch
- Kurz und präzise (max. 3-4 Sätze)
- VaTo24-Stil: professionell, modern, vertrauenswürdig
- Kein vollständiges HTML im newContent — nur den reinen Elementinhalt
SYSTEM;

// ---- Claude Runner aufrufen ------------------------------------------------
$requestBody = json_encode([
    'prompt'        => $userMessage,
    'system_prompt' => $systemPrompt,
    'model'         => RUNNER_MODEL,
], JSON_UNESCAPED_UNICODE);

$ch = curl_init(RUNNER_URL . '/query');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $requestBody,
    CURLOPT_TIMEOUT        => RUNNER_TIMEOUT,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . RUNNER_TOKEN,
    ],
]);

$response  = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    json_out(['message' => 'Verbindungsfehler zum Claude Runner: ' . $curlError, 'applyData' => null], 502);
}

if ($httpCode !== 200) {
    $errData = json_decode($response, true);
    $errMsg  = $errData['error'] ?? "HTTP {$httpCode}";
    json_out(['message' => "Runner-Fehler: {$errMsg}", 'applyData' => null], 502);
}

$result  = json_decode($response, true);
$rawText = $result['content'] ?? '';

if (empty($rawText)) {
    json_out(['message' => 'Leere Antwort vom Runner.', 'applyData' => null], 502);
}

// ---- NOVA_APPLY Direktive parsen -------------------------------------------
$applyData = null;

if (preg_match('/NOVA_APPLY:(\{[^}]+\})/s', $rawText, $matches)) {
    $parsed = json_decode($matches[1], true);

    if (is_array($parsed) && isset($parsed['changeType'], $parsed['newContent'])) {
        $ct = $parsed['changeType'];

        // Change-Type Permission-Check
        if (!in_array($ct, $permissions['allowed_change_types'] ?? [])) {
            $rawText = trim(preg_replace('/NOVA_APPLY:\{[^}]+\}/s', '', $rawText));
            $rawText .= "\n\n⚠️ Änderungstyp '{$ct}' ist nicht erlaubt.";
        } else {
            // Inhaltslänge prüfen
            $content = $parsed['newContent'];
            if (mb_strlen($content) > $maxLen) {
                $content = mb_substr($content, 0, $maxLen);
            }

            $applyData = [
                'changeType' => $ct,
                'newContent' => $content,
            ];
            $rawText = trim(preg_replace('/NOVA_APPLY:\{[^}]+\}/s', '', $rawText));
        }
    }
}

json_out([
    'message'   => $rawText,
    'applyData' => $applyData,
    'usage'     => $result['usage'] ?? null,
]);
