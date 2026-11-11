<?php
/**
 * Module 8: Administrative Dashboard & System Overview
 * Borana University Employee Management System
 */

declare(strict_types=1);
define('APP_ROOT', dirname(__DIR__));

require_once APP_ROOT . '/includes/functions.php';
$pdo = require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/includes/auth.php';

// Require authenticated user
require_login('../auth/login.php');

$page_title = 'Executive Administration Dashboard';
$current_page = 'dashboard';

// Fetch aggregate statistics from MySQL
// 1. Employee totals
$stmt = $pdo->query("SELECT 
    COUNT(*) AS total_employees,
    SUM(CASE WHEN staff_category = 'academic' THEN 1 ELSE 0 END) AS total_academic,
    SUM(CASE WHEN staff_category = 'administrative' THEN 1 ELSE 0 END) AS total_admin,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS total_active,
    SUM(CASE WHEN status = 'on_leave' THEN 1 ELSE 0 END) AS total_on_leave
FROM employees");
$stats_emp = $stmt->fetch();

// 2. Colleges & Departments
$total_colleges = (int) $pdo->query("SELECT COUNT(*) FROM colleges")->fetchColumn();
$total_departments = (int) $pdo->query("SELECT COUNT(*) FROM departments")->fetchColumn();

// 3. Today's Attendance breakdown
$stmt = $pdo->query("SELECT 
    SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) AS present_count,
    SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) AS late_count,
    SUM(CASE WHEN status = 'half_day' THEN 1 ELSE 0 END) AS half_day_count,
    SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) AS absent_count
FROM attendance 
WHERE date = CURDATE()");
$stats_att = $stmt->fetch();

// 4. Leave request metrics
$stmt = $pdo->query("SELECT 
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_leaves,
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved_leaves,
    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected_leaves
FROM leave_requests");
$stats_leaves = $stmt->fetch();

// 5. Recent Activity Logs (Audit Trail)
$stmt = $pdo->query("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 6");
$recent_activities = $stmt->fetchAll();

// 6. Recent Employee Registrations
$stmt = $pdo->query("
    SELECT e.*, c.code AS college_code, d.name AS dept_name 
    FROM employees e
    LEFT JOIN colleges c ON e.college_id = c.id
    LEFT JOIN departments d ON e.department_id = d.id
    ORDER BY e.created_at DESC 
    LIMIT 5
");
$recent_employees = $stmt->fetchAll();

// Include Layout Header & Sidebar
require_once APP_ROOT . '/includes/header.php';
require_once APP_ROOT . '/includes/sidebar.php';
?>

<!-- Main Content Area -->
<div class="main-content flex-grow-1 d-flex flex-column min-vh-100" style="background-color: #f8fafc;">
    <?php require_once APP_ROOT . '/includes/navbar.php'; ?>

    <div class="container-fluid p-4">
        <?= display_flash() ?>

        <!-- Welcome Banner -->
        <div class="card bg-white border-0 shadow-sm mb-4">
            <div class="card-body p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div>
                    <h5 class="fw-bold text-dark mb-1">Borana University Management Information Portal</h5>
                    <p class="text-muted small mb-0">System active &middot; Date: <strong><?= date('l, d F Y') ?></strong> &middot; Academic Year 2026/27</p>
                </div>
                <div class="d-flex gap-2">
                    <a href="../admin/employees/index.php" class="btn btn-sm btn-outline-secondary">
                        <i class="bi bi-search me-1"></i> Search Staff
                    </a>
                    <a href="../admin/reports/index.php" class="btn btn-sm btn-dark bg-bu-navy border-0">
                        <i class="bi bi-printer me-1"></i> Generate Reports
                    </a>
                </div>
            </div>
        </div>

        <!-- 8 Stat Cards in Grid -->
        <div class="row g-3 mb-4">
            <!-- Total Employees -->
            <div class="col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm h-100 p-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-semibold">TOTAL WORKFORCE</span>
                        <div class="bg-primary bg-opacity-10 text-primary rounded p-2">
                            <i class="bi bi-people-fill fs-5"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-1 font-mono"><?= number_format((int)($stats_emp['total_employees'] ?? 0)) ?></h3>
                    <div class="text-muted small">
                        <span class="text-success fw-medium"><?= (int)($stats_emp['total_active'] ?? 0) ?> Active</span> &middot; 
                        <span><?= (int)($stats_emp['total_on_leave'] ?? 0) ?> On Leave</span>
                    </div>
                </div>
            </div>

            <!-- Academic Staff -->
            <div class="col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm h-100 p-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-semibold">ACADEMIC FACULTY</span>
                        <div class="bg-info bg-opacity-10 text-info rounded p-2">
                            <i class="bi bi-mortarboard-fill fs-5"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-1 font-mono text-info"><?= (int)($stats_emp['total_academic'] ?? 0) ?></h3>
                    <div class="text-muted small">Professors, Lecturers, Researchers</div>
                </div>
            </div>

            <!-- Administrative Staff -->
            <div class="col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm h-100 p-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-semibold">ADMINISTRATIVE STAFF</span>
                        <div class="bg-secondary bg-opacity-10 text-secondary rounded p-2">
                            <i class="bi bi-briefcase-fill fs-5"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-1 font-mono text-secondary"><?= (int)($stats_emp['total_admin'] ?? 0) ?></h3>
                    <div class="text-muted small">Registrar, Finance, HR, IT Support</div>
                </div>
            </div>

            <!-- Colleges & Depts -->
            <div class="col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm h-100 p-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-semibold">FACULTIES & UNITS</span>
                        <div class="bg-warning bg-opacity-10 text-warning rounded p-2">
                            <i class="bi bi-diagram-3-fill fs-5"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-1 font-mono"><?= $total_colleges ?> <span class="fs-6 text-muted fw-normal">/ <?= $total_departments ?> Depts</span></h3>
                    <div class="text-muted small">University Organizational Matrix</div>
                </div>
            </div>

            <!-- Attendance Today -->
            <div class="col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm h-100 p-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-semibold">TODAY'S PRESENT</span>
                        <div class="bg-success bg-opacity-10 text-success rounded p-2">
                            <i class="bi bi-check2-circle fs-5"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-1 font-mono text-success"><?= (int)($stats_att['present_count'] ?? 0) ?></h3>
                    <div class="text-muted small">
                        <span><?= (int)($stats_att['late_count'] ?? 0) ?> Late</span> &middot; 
                        <span class="text-danger"><?= (int)($stats_att['absent_count'] ?? 0) ?> Absent</span>
                    </div>
                </div>
            </div>

            <!-- Pending Leaves -->
            <div class="col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm h-100 p-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-semibold">PENDING LEAVES</span>
                        <div class="bg-warning bg-opacity-10 text-warning rounded p-2">
                            <i class="bi bi-hourglass-split fs-5"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-1 font-mono text-warning"><?= (int)($stats_leaves['pending_leaves'] ?? 0) ?></h3>
                    <div class="text-muted small">
                        <a href="../admin/leaves/index.php" class="text-decoration-none">Review Requests &rarr;</a>
                    </div>
                </div>
            </div>

            <!-- Approved Leaves -->
            <div class="col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm h-100 p-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-semibold">APPROVED LEAVES</span>
                        <div class="bg-info bg-opacity-10 text-info rounded p-2">
                            <i class="bi bi-check-all fs-5"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-1 font-mono text-dark"><?= (int)($stats_leaves['approved_leaves'] ?? 0) ?></h3>
                    <div class="text-muted small">Annual, sick, maternity & study</div>
                </div>
            </div>

            <!-- System Role -->
            <div class="col-sm-6 col-xl-3">
                <div class="card border-0 shadow-sm h-100 p-3 bg-light">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-semibold">CURRENT ACTIVE ROLE</span>
                        <div class="bg-dark text-white rounded p-2">
                            <i class="bi bi-person-badge fs-5"></i>
                        </div>
                    </div>
                    <h5 class="fw-bold mb-1"><?= e(ucwords(str_replace('_', ' ', $user['role_name'] ?? 'User'))) ?></h5>
                    <div class="text-muted small">Session Protected &bull; Group 3</div>
                </div>
            </div>
        </div>

        <!-- Section: Recent Staff Registry & Activity Logs -->
        <div class="row g-4">
            <!-- Left: Recent Employees -->
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white py-3 d-flex align-items-center justify-content-between">
                        <h6 class="fw-bold mb-0 text-dark">Recent Employee Registrations</h6>
                        <a href="../admin/employees/create.php" class="btn btn-sm btn-bu-navy text-white">
                            <i class="bi bi-plus-lg me-1"></i> Register Employee
                        </a>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Category</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (empty($recent_employees)): ?>
                                    <tr><td colspan="5" class="text-center py-4 text-muted">No registered employees yet.</td></tr>
                                <?php else: ?>
                                    <?php foreach ($recent_employees as $emp): ?>
                                    <tr>
                                        <td class="font-mono fw-bold text-bu-navy"><?= e($emp['employee_id']) ?></td>
                                        <td>
                                            <div class="fw-semibold text-dark"><?= e($emp['first_name'] . ' ' . $emp['father_name']) ?></div>
                                            <small class="text-muted"><?= e($emp['position']) ?></small>
                                        </td>
                                        <td>
                                            <?php if ($emp['staff_category'] === 'academic'): ?>
                                                <span class="badge badge-academic">Academic</span>
                                            <?php else: ?>
                                                <span class="badge badge-admin">Administrative</span>
                                            <?php endif; ?>
                                        </td>
                                        <td>
                                            <div class="text-dark small"><?= e($emp['dept_name'] ?? 'Unassigned') ?></div>
                                            <small class="text-muted"><?= e($emp['college_code'] ?? '') ?></small>
                                        </td>
                                        <td>
                                            <?php if ($emp['status'] === 'active'): ?>
                                                <span class="badge bg-success-subtle text-success">Active</span>
                                            <?php elseif ($emp['status'] === 'on_leave'): ?>
                                                <span class="badge bg-warning-subtle text-warning">On Leave</span>
                                            <?php else: ?>
                                                <span class="badge bg-secondary-subtle text-secondary"><?= e(ucfirst($emp['status'])) ?></span>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Right: Activity Logs (Audit Trail) -->
            <div class="col-lg-4">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white py-3">
                        <h6 class="fw-bold mb-0 text-dark">Recent System Activity (Audit)</h6>
                    </div>
                    <div class="card-body p-0">
                        <div class="list-group list-group-flush">
                            <?php foreach ($recent_activities as $act): ?>
                            <div class="list-group-item p-3">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="fw-semibold text-dark small"><?= e($act['action']) ?></span>
                                    <small class="text-muted" style="font-size: 0.7rem;"><?= date('H:i M d', strtotime($act['created_at'])) ?></small>
                                </div>
                                <p class="text-muted small mb-1"><?= e($act['details'] ?? '') ?></p>
                                <small class="text-secondary" style="font-size: 0.72rem;">
                                    By: <strong><?= e($act['username']) ?></strong> &middot; IP: <?= e($act['ip_address'] ?? '127.0.0.1') ?>
                                </small>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
