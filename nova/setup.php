<?php
/**
 * Nova CMS — Setup / Password Hash Generator
 *
 * Run ONCE from CLI to generate the password hash for config.php:
 *   php nova/setup.php
 *
 * Then copy the output hash into config.php → NOVA_PASSWORD_HASH constant.
 * DELETE this file after setup!
 */

// Only allow CLI execution for security
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('Setup may only be run from the command line. Delete this file after use.');
}

echo "\n=== Nova CMS Setup ===\n\n";

echo "Enter new Nova password: ";
$password = trim(fgets(STDIN));

if (strlen($password) < 8) {
    echo "Error: Password must be at least 8 characters.\n";
    exit(1);
}

$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

echo "\nPassword hash (copy to config.php → NOVA_PASSWORD_HASH):\n\n";
echo "'" . $hash . "'\n\n";
echo "Example config.php line:\n";
echo "define('NOVA_PASSWORD_HASH', '" . $hash . "');\n\n";

echo "IMPORTANT: Delete this setup.php file after use!\n\n";
