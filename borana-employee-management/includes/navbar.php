<?php
/**
 * Top Navigation Bar Component
 * Borana University Employee Management System
 */
$user = current_user();
?>
<nav class="top-navbar d-flex align-items-center justify-content-between px-4 no-print flex-grow-1">
    <!-- Breadcrumb or Title -->
    <div class="d-flex align-items-center gap-2">
        <span class="fw-semibold text-secondary" style="font-size: 0.85rem;">Borana University Portal</span>
        <span class="text-muted">/</span>
        <span class="fw-bold text-dark" style="font-size: 0.95rem;"><?= e($page_title ?? 'Dashboard') ?></span>
    </div>

    <!-- Right Profile & Quick Actions -->
    <div class="d-flex align-items-center gap-3">
        <!-- Role Indicator -->
        <span class="badge bg-light text-dark border px-2.5 py-1.5" style="font-size: 0.78rem;">
            <i class="bi bi-shield-check text-success me-1"></i>
            <?= e(ucwords(str_replace('_', ' ', $user['role_name'] ?? 'Guest'))) ?>
        </span>

        <!-- User Profile Dropdown -->
        <div class="dropdown">
            <button class="btn btn-sm btn-link text-dark text-decoration-none dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <div class="bg-bu-navy text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 34px; height: 34px; font-size: 0.85rem; font-weight: 600;">
                    <?= strtoupper(substr($user['full_name'] ?? 'U', 0, 1)) ?>
                </div>
                <div class="text-start d-none d-md-block">
                    <div class="fw-bold" style="font-size: 0.82rem; line-height: 1.1;"><?= e($user['full_name'] ?? 'Guest User') ?></div>
                    <small class="text-muted" style="font-size: 0.72rem;"><?= e($user['email'] ?? '') ?></small>
                </div>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                <li><h6 class="dropdown-header">Signed in as <?= e($user['username'] ?? '') ?></h6></li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a class="dropdown-item text-danger d-flex align-items-center gap-2" href="/borana-employee-management/auth/logout.php">
                        <i class="bi bi-box-arrow-right"></i>
                        <span>Sign Out</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
