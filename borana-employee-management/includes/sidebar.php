<?php
/**
 * Role-Based Sidebar Navigation Component
 * Borana University Employee Management System
 */
defined('APP_ROOT') or define('APP_ROOT', dirname(__DIR__));
$app_config = file_exists(APP_ROOT . '/config/app.php') ? require(APP_ROOT . '/config/app.php') : [];
$user = current_user();
$role = $user['role_name'] ?? 'guest';
$current_page = $current_page ?? 'dashboard';
?>
<aside class="sidebar d-flex flex-column flex-shrink-0 p-3 no-print">
    <!-- Brand / Crest Header -->
    <div class="d-flex align-items-center pb-3 mb-3 border-bottom border-secondary border-opacity-25 px-2">
        <div class="bg-white rounded-circle p-1 me-2 shadow-sm" style="width: 44px; height: 44px; display: grid; place-items: center;">
            <i class="bi bi-mortarboard-fill text-bu-navy fs-4"></i>
        </div>
        <div>
            <h6 class="text-white mb-0 fw-bold tracking-tight"><?= strtoupper(e($app_config['institution_name'] ?? 'BORANA UNIVERSITY')) ?></h6>
            <small class="text-bu-gold fw-semibold" style="font-size: 0.72rem;"><?= e($app_config['app_short_name'] ?? 'Employee Portal') ?></small>
        </div>
    </div>

    <!-- Navigation Menu Items -->
    <ul class="nav nav-pills flex-column mb-auto">
        <!-- 1. Dashboard -->
        <li class="nav-item">
            <a href="/borana-employee-management/admin/dashboard.php" class="nav-link <?= $current_page === 'dashboard' ? 'active' : '' ?>">
                <i class="bi bi-speedometer2"></i>
                <span>Dashboard</span>
            </a>
        </li>

        <?php if (has_role(['super_admin', 'hr_admin'])): ?>
        <!-- Module 1 & 2: Employee Management -->
        <li class="nav-item">
            <a href="/borana-employee-management/admin/employees/index.php" class="nav-link <?= $current_page === 'employees' ? 'active' : '' ?>">
                <i class="bi bi-people-fill"></i>
                <span>Employees Registry</span>
            </a>
        </li>
        <?php endif; ?>

        <?php if (has_role(['super_admin', 'hr_admin'])): ?>
        <!-- Module 3: Colleges & Departments -->
        <li class="nav-item">
            <a href="/borana-employee-management/admin/colleges/index.php" class="nav-link <?= $current_page === 'colleges' ? 'active' : '' ?>">
                <i class="bi bi-building"></i>
                <span>Colleges</span>
            </a>
        </li>
        <li class="nav-item">
            <a href="/borana-employee-management/admin/departments/index.php" class="nav-link <?= $current_page === 'departments' ? 'active' : '' ?>">
                <i class="bi bi-diagram-3-fill"></i>
                <span>Departments</span>
            </a>
        </li>
        <?php endif; ?>

        <!-- Module 4: Attendance Management -->
        <li class="nav-item">
            <a href="/borana-employee-management/admin/attendance/index.php" class="nav-link <?= $current_page === 'attendance' ? 'active' : '' ?>">
                <i class="bi bi-clock-history"></i>
                <span>Attendance</span>
            </a>
        </li>

        <!-- Module 5: Leave Management -->
        <li class="nav-item">
            <a href="/borana-employee-management/admin/leaves/index.php" class="nav-link <?= $current_page === 'leaves' ? 'active' : '' ?>">
                <i class="bi bi-calendar2-check"></i>
                <span>Leave Requests</span>
            </a>
        </li>

        <?php if (has_role(['super_admin', 'hr_admin'])): ?>
        <!-- Module 8: Administrative Reports -->
        <li class="nav-item">
            <a href="/borana-employee-management/admin/reports/index.php" class="nav-link <?= $current_page === 'reports' ? 'active' : '' ?>">
                <i class="bi bi-file-earmark-bar-graph"></i>
                <span>Reports & Analytics</span>
            </a>
        </li>
        <?php endif; ?>

        <?php if (has_role('super_admin')): ?>
        <!-- Module 7: User Management (Super Admin) -->
        <li class="nav-item">
            <a href="/borana-employee-management/admin/users/index.php" class="nav-link <?= $current_page === 'users' ? 'active' : '' ?>">
                <i class="bi bi-shield-lock-fill"></i>
                <span>User Accounts & RBAC</span>
            </a>
        </li>
        <?php endif; ?>
    </ul>

    <!-- Project Information Badge -->
    <div class="mt-auto pt-3 border-top border-secondary border-opacity-25 px-2">
        <div class="p-2 rounded bg-white bg-opacity-10 text-white" style="font-size: 0.75rem;">
            <div class="fw-semibold text-bu-gold">Project Group 3 (Nov 2026)</div>
            <div class="text-white-50">Samuel, Yohanis, Wayneshet, Tsegaye</div>
        </div>
        <div class="mt-2 text-center text-white-50" style="font-size: 0.7rem;">
            Borana University &copy; 2026
        </div>
    </div>
</aside>
