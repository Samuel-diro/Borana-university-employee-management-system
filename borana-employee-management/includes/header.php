<?php
/**
 * Global Header Component (Bootstrap 5 & Custom CSS)
 * Borana University Employee Management System
 */
defined('APP_ROOT') or define('APP_ROOT', dirname(__DIR__));
$app_config = file_exists(APP_ROOT . '/config/app.php') ? require(APP_ROOT . '/config/app.php') : [];
$page_title = $page_title ?? ($app_config['app_name'] ?? 'Employee Management System');
$institution_name = $app_config['institution_name'] ?? 'Borana University';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($page_title) ?> - <?= e($institution_name) ?></title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- Custom CSS (Editable in VS Code at assets/css/style.css) -->
    <link rel="stylesheet" href="/borana-employee-management/assets/css/style.css">
</head>
<body>
<div class="d-flex">
