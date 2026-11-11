<?php
/**
 * Root Router / Landing Controller
 * Borana University Employee Management System
 * Group 3 - November 2026
 */

declare(strict_types=1);
define('APP_ROOT', __DIR__);

require_once APP_ROOT . '/includes/functions.php';
require_once APP_ROOT . '/includes/auth.php';

if (is_logged_in()) {
    header("Location: admin/dashboard.php");
    exit;
} else {
    header("Location: auth/login.php");
    exit;
}
