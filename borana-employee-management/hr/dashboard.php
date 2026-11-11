<?php
/**
 * HR Administrator Dedicated Dashboard
 * Borana University Employee Management System
 */

declare(strict_types=1);
define('APP_ROOT', dirname(__DIR__));

require_once APP_ROOT . '/includes/functions.php';
$pdo = require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/includes/auth.php';

require_role(['super_admin', 'hr_admin'], '../auth/login.php');

// Redirect to comprehensive admin dashboard with HR-focused views
header("Location: ../admin/dashboard.php");
exit;
