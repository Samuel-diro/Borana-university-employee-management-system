<?php
/**
 * Core Helper Functions
 * Borana University Employee Management System
 * Group 3
 */

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Escape string for safe HTML output (XSS Prevention)
 */
function e(?string $string): string {
    return htmlspecialchars((string) $string, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Generate CSRF Token and store in session
 */
function generate_csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validate CSRF Token
 */
function validate_csrf_token(?string $token): bool {
    if (!isset($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Set flash alert message in session
 */
function set_flash(string $type, string $message): void {
    $_SESSION['flash'] = [
        'type' => $type, // 'success', 'danger', 'warning', 'info'
        'message' => $message
    ];
}

/**
 * Display flash message if present
 */
function display_flash(): string {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        $type = e($flash['type']);
        $msg = e($flash['message']);
        return "<div class='alert alert-{$type} alert-dismissible fade show' role='alert'>
                    {$msg}
                    <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
                </div>";
    }
    return '';
}

/**
 * Log administrative activity to database
 */
function log_activity(PDO $pdo, string $action, string $details = ''): void {
    $user_id = $_SESSION['user']['id'] ?? null;
    $username = $_SESSION['user']['username'] ?? 'guest';
    $role = $_SESSION['user']['role_name'] ?? 'guest';
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

    $stmt = $pdo->prepare("
        INSERT INTO activity_logs (user_id, username, user_role, action, details, ip_address)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$user_id, $username, $role, $action, $details, $ip]);
}

/**
 * Generate next sequential Employee ID (e.g. BU-EMP-011)
 */
function generate_employee_id(PDO $pdo): string {
    $stmt = $pdo->query("SELECT MAX(id) AS max_id FROM employees");
    $row = $stmt->fetch();
    $next_id = ($row['max_id'] ?? 0) + 1;
    return sprintf('BU-EMP-%03d', $next_id);
}

/**
 * Format Currency in Ethiopian Birr (ETB)
 */
function format_etb(float $amount): string {
    return number_format($amount, 2) . ' ETB';
}
