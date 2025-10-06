<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

// Completely disable PHP's file upload handling for this request if it's our avatar endpoint
if (
    strpos($_SERVER['REQUEST_URI'] ?? '', '/api/users/') !== false &&
    strpos($_SERVER['REQUEST_URI'] ?? '', '/avatar') !== false
) {
    // Skip PHP's file upload processing for avatar endpoints
    ini_set('file_uploads', 'Off');
}

// Force a writable temp directory
$customTempDir = __DIR__ . '/../storage/app/temp';
if (!is_dir($customTempDir)) {
    mkdir($customTempDir, 0777, true);
}
ini_set('upload_tmp_dir', $customTempDir);
ini_set('sys_temp_dir', $customTempDir);

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
