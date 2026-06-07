<?php
/**
 * Nova CMS — AI Chat Endpoint
 *
 * POST JSON: {message, context: {novaId, page, currentContent, elementType}}
 * Returns:   {message: string, applyData: null|{changeType, newContent}}
 */

require_once __DIR__ . '/config.php';

// ---- Headers ----------------------------------------------------------------
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function json_out(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
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

// ---- Parse request ----------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Nur POST erlaubt.'], 405);
}

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

if (empty(CLAUDE_API_KEY)) {
    json_out(['message' => 'Kein ANTHROPIC_API_KEY konfiguriert. Bitte in der Serverumgebung setzen.', 'applyData' => null], 503);
}

// ---- Build system prompt ----------------------------------------------------
$novaId       = htmlspecialchars($context['novaId']       ?? 'keines ausgewählt');
$pageName     = htmlspecialchars($context['page']         ?? 'Unbekannte Seite');
$elementType  = htmlspecialchars($context['elementType']  ?? 'unbekannt');
$currentContent = mb_substr($context['currentContent'] ?? '', 0, 500);

$systemPrompt = <<<SYSTEM
Du bist Nova, der KI-Website-Assistent von VaTo24. Du hilfst dabei, Website-Inhalte professionell zu bearbeiten.

Aktuell ausgewähltes Element:
- Element-ID: {$novaId}
- Seite: {$pageName}
- Typ: {$elementType}
- Aktueller Inhalt: {$currentContent}

Deine Aufgabe:
Wenn der Benutzer eine Änderung beschreibt:
1. Fasse kurz zusammen, was du verstanden hast (1-2 Sätze)
2. Zeige den neuen Text/Inhalt in einem Code-Block
3. Frage: "Soll ich diese Änderung übernehmen? [Ja / Nein]"

Wenn der Benutzer mit "Ja" oder "ja" bestätigt:
- Antworte mit genau diesem Format: NOVA_APPLY:{"changeType":"text","newContent":"...der neue Inhalt..."}
- Verwende "text" für normale Texte und Überschriften
- Verwende "html" nur wenn HTML-Formatierung nötig ist (Fettdruck, Listen etc.)
- Verwende "href" für Links, "src" für Bilder
- Das System übernimmt die Änderung dann automatisch

Wichtige Regeln:
- Halte Antworten kurz und klar (max 3-4 Sätze)
- Behalte den Stil und Ton der VaTo24-Website bei (professionell, modern, deutsch)
- Keine vollständigen HTML-Dokumente im newContent — nur den reinen Elementinhalt
- Bei "html"-Typ: nur erlaubte Tags: p, strong, em, a, br, ul, li, h2, h3, h4, span
SYSTEM;

// ---- Call Claude API --------------------------------------------------------
$messages = [
    ['role' => 'user', 'content' => $userMessage],
];

$requestBody = json_encode([
    'model'      => CLAUDE_MODEL,
    'max_tokens' => 1024,
    'system'     => $systemPrompt,
    'messages'   => $messages,
], JSON_UNESCAPED_UNICODE);

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $requestBody,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'x-api-key: ' . CLAUDE_API_KEY,
        'anthropic-version: 2023-06-01',
    ],
]);

$response     = curl_exec($ch);
$httpCode     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError    = curl_error($ch);
curl_close($ch);

if ($curlError) {
    json_out(['message' => 'Verbindungsfehler zur KI: ' . $curlError, 'applyData' => null], 502);
}

if ($httpCode !== 200) {
    $errDetail = '';
    $errData = json_decode($response, true);
    if (isset($errData['error']['message'])) {
        $errDetail = ' — ' . $errData['error']['message'];
    }
    json_out(['message' => 'Claude API Fehler (HTTP ' . $httpCode . ')' . $errDetail, 'applyData' => null], 502);
}

$apiData = json_decode($response, true);
$rawText = $apiData['content'][0]['text'] ?? '';

if (empty($rawText)) {
    json_out(['message' => 'Leere Antwort von der KI.', 'applyData' => null], 502);
}

// ---- Parse NOVA_APPLY directive ---------------------------------------------
$applyData = null;

if (preg_match('/NOVA_APPLY:(\{.*?\})/s', $rawText, $matches)) {
    $parsed = json_decode($matches[1], true);
    if (is_array($parsed) && isset($parsed['changeType'], $parsed['newContent'])) {
        $applyData = [
            'changeType' => $parsed['changeType'],
            'newContent' => $parsed['newContent'],
        ];
    }
    // Strip the NOVA_APPLY directive from the displayed message
    $rawText = trim(preg_replace('/NOVA_APPLY:\{.*?\}/s', '', $rawText));
}

json_out([
    'message'   => $rawText,
    'applyData' => $applyData,
]);
