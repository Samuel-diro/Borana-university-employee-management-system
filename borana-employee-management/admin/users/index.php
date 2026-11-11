<?php
/**
 * Module 7: User Authentication & Role-Based Access Control (RBAC) Management
 * Borana University Employee Management System
 */

declare(strict_types=1);
define('APP_ROOT', dirname(__DIR__, 2));

require_once APP_ROOT . '/includes/functions.php';
$pdo = require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/includes/auth.php';

// Strictly Super Administrator only
require_role('super_admin', '../dashboard.php');

$page_title = 'User Accounts & Role Permissions';
$current_page = 'users';

// Handle Add User
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create_user') {
    if (validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $username = trim($_POST['username'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $full_name = trim($_POST['full_name'] ?? '');
        $role_id = (int)($_POST['role_id'] ?? 4);
        $employee_id = !empty($_POST['employee_id']) ? trim($_POST['employee_id']) : null;
        $password = trim($_POST['password'] ?? '');

        if (!empty($username) && !empty($email) && !empty($password)) {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("
                INSERT INTO users (username, email, full_name, role_id, employee_id, password_hash, is_active)
                VALUES (?, ?, ?, ?, ?, ?, 1)
            ");
            $stmt->execute([$username, $email, $full_name, $role_id, $employee_id, $hash]);
            log_activity($pdo, 'Create User', "Created account '{$username}' with role ID {$role_id}");
            set_flash('success', "User account '{$username}' created successfully.");
            header("Location: index.php");
            exit;
        }
    }
}

// Fetch all users with roles
$users = $pdo->query("
    SELECT u.*, r.role_name, r.display_name AS role_display
    FROM users u
    JOIN roles r ON u.role_id = r.id
    ORDER BY u.id ASC
")->fetchAll();

$roles = $pdo->query("SELECT * FROM roles ORDER BY id ASC")->fetchAll();
$employees = $pdo->query("SELECT employee_id, first_name, father_name FROM employees ORDER BY first_name ASC")->fetchAll();
$csrf_token = generate_csrf_token();

require_once APP_ROOT . '/includes/header.php';
require_once APP_ROOT . '/includes/sidebar.php';
?>

<div class="main-content flex-grow-1 d-flex flex-column min-vh-100" style="background-color: #f8fafc;">
    <?php require_once APP_ROOT . '/includes/navbar.php'; ?>

    <div class="container-fluid p-4">
        <?= display_flash() ?>

        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
                <h4 class="fw-bold mb-1 text-dark">User Authentication & Role-Based Access Control</h4>
                <p class="text-muted small mb-0">Module 7: System administrators, HR officers, department heads, and employee roles</p>
            </div>
            <button class="btn btn-bu-navy text-white shadow-sm" data-bs-toggle="modal" data-bs-target="#addUserModal">
                <i class="bi bi-person-plus me-1"></i> Provision New User
            </button>
        </div>

        <!-- Role Permissions Matrix Guide -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white py-3">
                <h6 class="fw-bold mb-0 text-dark"><i class="bi bi-shield-check text-success me-2"></i>Institutional RBAC Privilege Matrix</h6>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-bordered mb-0 small">
                        <thead class="bg-light">
                            <tr>
                                <th>Role</th>
                                <th>Employee CRUD</th>
                                <th>Colleges & Depts</th>
                                <th>Attendance Tracking</th>
                                <th>Leave Approvals</th>
                                <th>Reports & Exports</th>
                                <th>User Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="fw-bold text-dark">Super Administrator</td>
                                <td class="text-success"><i class="bi bi-check-circle-fill"></i> Full</td>
                                <td class="text-success"><i class="bi bi-check-circle-fill"></i> Full</td>
                                <td class="text-success"><i class="bi bi-check-circle-fill"></i> Full</td>
                                <td class="text-success"><i class="bi bi-check-circle-fill"></i> Full</td>
                                <td class="text-success"><i class="bi bi-check-circle-fill"></i> Full</td>
                                <td class="text-success"><i class="bi bi-check-circle-fill"></i> Full</td>
                            </tr>
                            <tr>
                                <td class="fw-bold text-dark">HR Administrator</td>
                                <td class="text-success"><i class="bi bi-check-circle-fill"></i> Full</td>
                                <td class="text-muted"><i class="bi bi-eye"></i> View Only</td>
                                <td class="text-success"><i class="bi bi-check-circle-fill"></i> Full</td>
                                <td class="text-success"><i class="bi bi-check-circle-fill"></i> Final Approve</td>
                                <td class="text-success"><i class="bi bi-check-circle-fill"></i> Full</td>
                                <td class="text-danger"><i class="bi bi-x-circle-fill"></i> Restricted</td>
                            </tr>
                            <tr>
                                <td class="fw-bold text-dark">Department Head</td>
                                <td class="text-muted"><i class="bi bi-eye"></i> Dept Only</td>
                                <td class="text-muted"><i class="bi bi-eye"></i> View Only</td>
                                <td class="text-success"><i class="bi bi-check-circle-fill"></i> Dept Audit</td>
                                <td class="text-info"><i class="bi bi-check-circle-fill"></i> Endorse / Review</td>
                                <td class="text-muted"><i class="bi bi-eye"></i> Dept Only</td>
                                <td class="text-danger"><i class="bi bi-x-circle-fill"></i> Restricted</td>
                            </tr>
                            <tr>
                                <td class="fw-bold text-dark">Employee</td>
                                <td class="text-muted"><i class="bi bi-eye"></i> Own Profile</td>
                                <td class="text-muted"><i class="bi bi-eye"></i> Directory</td>
                                <td class="text-info"><i class="bi bi-clock"></i> Self Check-In</td>
                                <td class="text-info"><i class="bi bi-calendar-plus"></i> Submit Own</td>
                                <td class="text-danger"><i class="bi bi-x-circle-fill"></i> Restricted</td>
                                <td class="text-danger"><i class="bi bi-x-circle-fill"></i> Restricted</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Users Table -->
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white py-3">
                <h6 class="fw-bold mb-0 text-dark">Provisioned System Accounts (<?= count($users) ?>)</h6>
            </div>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name & Email</th>
                            <th>Assigned Role</th>
                            <th>Linked Employee ID</th>
                            <th>Status</th>
                            <th>Last Login</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $u): ?>
                        <tr>
                            <td class="font-mono fw-bold text-bu-navy"><?= e($u['username']) ?></td>
                            <td>
                                <div class="fw-semibold text-dark"><?= e($u['full_name']) ?></div>
                                <small class="text-muted font-mono"><?= e($u['email']) ?></small>
                            </td>
                            <td>
                                <span class="badge bg-bu-navy text-white px-2.5 py-1.5"><?= e($u['role_display']) ?></span>
                            </td>
                            <td>
                                <span class="font-mono small"><?= e($u['employee_id'] ?? 'N/A') ?></span>
                            </td>
                            <td>
                                <?php if ($u['is_active']): ?>
                                    <span class="badge bg-success-subtle text-success">Active</span>
                                <?php else: ?>
                                    <span class="badge bg-danger-subtle text-danger">Disabled</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <small class="text-muted"><?= !empty($u['last_login']) ? date('d M Y H:i', strtotime($u['last_login'])) : 'Never' ?></small>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Add User Modal -->
    <div class="modal fade" id="addUserModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form method="POST" action="index.php">
                    <input type="hidden" name="action" value="create_user">
                    <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                    <div class="modal-header bg-bu-navy text-white">
                        <h5 class="modal-title fw-bold">Provision New User</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Username *</label>
                            <input type="text" name="username" class="form-control" placeholder="e.g. jdoe" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Email Address *</label>
                            <input type="email" name="email" class="form-control" placeholder="jdoe@borana.edu.et" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Full Name *</label>
                            <input type="text" name="full_name" class="form-control" placeholder="e.g. John Doe Bekele" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Role *</label>
                            <select name="role_id" class="form-select" required>
                                <?php foreach ($roles as $r): ?>
                                    <option value="<?= $r['id'] ?>"><?= e($r['display_name']) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Link to Employee (Optional)</label>
                            <select name="employee_id" class="form-select">
                                <option value="">-- Standalone User --</option>
                                <?php foreach ($employees as $emp): ?>
                                    <option value="<?= e($emp['employee_id']) ?>">
                                        <?= e($emp['employee_id']) ?> - <?= e($emp['first_name'] . ' ' . $emp['father_name']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Initial Password *</label>
                            <input type="password" name="password" class="form-control" placeholder="Enter secure password" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-bu-navy text-white">Create Account</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
