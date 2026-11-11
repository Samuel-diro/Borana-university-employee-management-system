<?php
/**
 * Authentication and Access Control Layer
 * Borana University Employee Management System
 * Group 3
 */

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Check if a user is currently authenticated
 */
function is_logged_in(): bool {
    return isset($_SESSION['user']) && !empty($_SESSION['user']['id']);
}

/**
 * Get currently authenticated user data
 */
function current_user(): ?array {
    return $_SESSION['user'] ?? null;
}

/**
 * Check if the user has a specific role or belongs to an allowed role set
 * Roles: 'super_admin', 'hr_admin', 'department_head', 'employee'
 */
function has_role(array|string $allowed_roles): bool {
    if (!is_logged_in()) {
        return false;
    }
    $user_role = $_SESSION['user']['role_name'] ?? '';
    
    if (is_string($allowed_roles)) {
        $allowed_roles = [$allowed_roles];
    }
    
    // Super Administrator has unrestricted access across all modules
    if ($user_role === 'super_admin') {
        return true;
    }
    
    return in_array($user_role, $allowed_roles, true);
}

/**
 * Enforce authentication: Redirect to login if unauthenticated
 */
function require_login(string $base_url = '../../auth/login.php'): void {
    if (!is_logged_in()) {
        $_SESSION['redirect_after_login'] = $_SERVER['REQUEST_URI'];
        header("Location: {$base_url}");
        exit;
    }
}

/**
 * Enforce role-based permission: Stop unauthorized access
 */
function require_role(array|string $allowed_roles, string $redirect_to = '../../index.php'): void {
    require_login();
    
    if (!has_role($allowed_roles)) {
        http_response_code(403);
        die("<div style='font-family:sans-serif;padding:30px;background:#fef2f2;border:1px solid #f87171;color:#991b1b;max-width:600px;margin:50px auto;border-radius:8px;'>
            <h3 style='margin-top:0;'>Access Denied - 403 Forbidden</h3>
            <p>You do not have the required institutional authorization to access this Borana University administrative module.</p>
            <p><a href='{$redirect_to}' style='color:#0a2540;font-weight:bold;'>&larr; Return to Dashboard</a></p>
        </div>");
    }
}
