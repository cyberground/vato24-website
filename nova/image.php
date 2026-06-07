<?php
/**
 * Nova CMS — Image Upload & Processing Endpoint
 *
 * POST multipart/form-data: image file
 * Returns: {success: true, urls: {1920, 1280, 800, 400}} | {success: false, error: string}
 *
 * Processing: GD library, converts to WebP, creates 4 responsive sizes with smart crop.
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

// ---- CSRF check -------------------------------------------------------------
$csrfHeader = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (empty($csrfHeader) || empty($_SESSION['nova_csrf']) || !hash_equals($_SESSION['nova_csrf'], $csrfHeader)) {
    json_out(['success' => false, 'error' => 'Ungültiges CSRF-Token.'], 403);
}

// ---- Check GD ---------------------------------------------------------------
if (!extension_loaded('gd')) {
    json_out(['success' => false, 'error' => 'GD-Erweiterung nicht verfügbar.'], 500);
}

// ---- Validate upload --------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['success' => false, 'error' => 'Nur POST erlaubt.'], 405);
}

if (empty($_FILES['image'])) {
    json_out(['success' => false, 'error' => 'Kein Bild hochgeladen (Feld: image).'], 400);
}

$file = $_FILES['image'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    $uploadErrors = [
        UPLOAD_ERR_INI_SIZE   => 'Datei zu groß (php.ini Limit).',
        UPLOAD_ERR_FORM_SIZE  => 'Datei zu groß (Form-Limit).',
        UPLOAD_ERR_PARTIAL    => 'Upload unvollständig.',
        UPLOAD_ERR_NO_FILE    => 'Keine Datei empfangen.',
        UPLOAD_ERR_NO_TMP_DIR => 'Kein temporäres Verzeichnis.',
        UPLOAD_ERR_CANT_WRITE => 'Schreibfehler.',
        UPLOAD_ERR_EXTENSION  => 'Upload durch PHP-Erweiterung blockiert.',
    ];
    $msg = $uploadErrors[$file['error']] ?? 'Upload-Fehler #' . $file['error'];
    json_out(['success' => false, 'error' => $msg], 400);
}

$maxBytes = 10 * 1024 * 1024; // 10 MB
if ($file['size'] > $maxBytes) {
    json_out(['success' => false, 'error' => 'Datei zu groß (max. 10 MB).'], 400);
}

// Validate MIME type via GD (not just file extension)
$imageInfo = @getimagesize($file['tmp_name']);
if ($imageInfo === false) {
    json_out(['success' => false, 'error' => 'Ungültiges Bildformat.'], 400);
}

$allowedMimes = [
    IMAGETYPE_JPEG => 'imagecreatefromjpeg',
    IMAGETYPE_PNG  => 'imagecreatefrompng',
    IMAGETYPE_WEBP => 'imagecreatefromwebp',
    IMAGETYPE_GIF  => 'imagecreatefromgif',
];

$imageType = $imageInfo[2];
if (!isset($allowedMimes[$imageType])) {
    json_out(['success' => false, 'error' => 'Nur JPEG, PNG, WebP und GIF erlaubt.'], 400);
}

// ---- Load image -------------------------------------------------------------
$loaderFunc = $allowedMimes[$imageType];
$source = @$loaderFunc($file['tmp_name']);
if ($source === false) {
    json_out(['success' => false, 'error' => 'Bild konnte nicht geladen werden.'], 500);
}

$origWidth  = imagesx($source);
$origHeight = imagesy($source);

if ($origWidth <= 0 || $origHeight <= 0) {
    json_out(['success' => false, 'error' => 'Ungültige Bildabmessungen.'], 400);
}

// ---- Smart crop: find dominant non-white/non-dark region --------------------
function findCropCenter($img, int $width, int $height): array {
    $sampleX   = 9;
    $sampleY   = 9;
    $totalX    = 0;
    $totalY    = 0;
    $count     = 0;

    for ($gy = 0; $gy < $sampleY; $gy++) {
        for ($gx = 0; $gx < $sampleX; $gx++) {
            $px = (int)(($gx + 0.5) * $width  / $sampleX);
            $py = (int)(($gy + 0.5) * $height / $sampleY);
            $rgb = imagecolorat($img, $px, $py);
            $r   = ($rgb >> 16) & 0xFF;
            $g   = ($rgb >> 8)  & 0xFF;
            $b   = $rgb & 0xFF;
            $brightness = ($r + $g + $b) / 3;

            // Skip nearly-white (>230) and nearly-black (<25) pixels
            if ($brightness < 230 && $brightness > 25) {
                $totalX += $px;
                $totalY += $py;
                $count++;
            }
        }
    }

    if ($count === 0) {
        return ['x' => $width / 2, 'y' => $height / 2];
    }

    return ['x' => $totalX / $count, 'y' => $totalY / $count];
}

$cropCenter = findCropCenter($source, $origWidth, $origHeight);

// ---- Prepare output directory -----------------------------------------------
$uploadDir = NOVA_SITE_ROOT . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'uploaded';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        json_out(['success' => false, 'error' => 'Upload-Verzeichnis konnte nicht erstellt werden.'], 500);
    }
}

// Sanitize original filename
$origName  = pathinfo($file['name'], PATHINFO_FILENAME);
$origName  = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $origName);
$origName  = mb_substr($origName, 0, 40);
$timestamp = time();

$sizes = [1920, 1280, 800, 400];
$urls  = [];

foreach ($sizes as $targetWidth) {
    // Skip if target wider than original
    if ($targetWidth > $origWidth) {
        // Use original width
        $targetWidth = $origWidth;
    }

    $ratio        = $targetWidth / $origWidth;
    $targetHeight = (int)round($origHeight * $ratio);

    // Create resized canvas
    $resized = imagecreatetruecolor($targetWidth, $targetHeight);

    // Preserve transparency for PNG/WebP
    if ($imageType === IMAGETYPE_PNG || $imageType === IMAGETYPE_WEBP) {
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
        imagefilledrectangle($resized, 0, 0, $targetWidth, $targetHeight, $transparent);
    }

    // Smart crop source coordinates
    $srcX = (int)max(0, $cropCenter['x'] - ($origWidth  / 2));
    $srcY = (int)max(0, $cropCenter['y'] - ($origHeight / 2));
    // Clamp
    $srcX = min($srcX, $origWidth  - $origWidth);
    $srcY = min($srcY, $origHeight - $origHeight);

    imagecopyresampled(
        $resized,
        $source,
        0, 0,           // dst x, y
        0, 0,           // src x, y (full image, scale uniformly)
        $targetWidth,
        $targetHeight,
        $origWidth,
        $origHeight
    );

    $filename = "{$timestamp}_{$origName}_{$targetWidth}w.webp";
    $fileDest = $uploadDir . DIRECTORY_SEPARATOR . $filename;

    imagewebp($resized, $fileDest, 85);
    imagedestroy($resized);

    $urls[$targetWidth] = '/images/uploaded/' . $filename;
}

imagedestroy($source);

json_out([
    'success' => true,
    'urls'    => $urls,
    'sizes'   => $sizes,
]);
