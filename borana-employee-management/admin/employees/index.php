<?php
/**
 * Module 1, 2 & 6: Employee Management & Unified Search Registry
 * Borana University Employee Management System
 */

declare(strict_types=1);
define('APP_ROOT', dirname(__DIR__, 2));

require_once APP_ROOT . '/includes/functions.php';
$pdo = require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/includes/auth.php';

require_login('../../auth/login.php');

$page_title = 'Employee Records Registry';
$current_page = 'employees';

// Handle Delete Request
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    if (has_role(['super_admin', 'hr_admin'])) {
        $del_id = (int) $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM employees WHERE id = ?");
        $stmt->execute([$del_id]);
        log_activity($pdo, 'Delete Employee', "Deleted employee record ID #{$del_id}");
        set_flash('success', 'Employee record was permanently removed from the institutional database.');
        header("Location: index.php");
        exit;
    }
}

// Search and Filter parameters
$search = trim($_GET['search'] ?? '');
$category = trim($_GET['category'] ?? ''); // 'academic' | 'administrative'
$college_id = trim($_GET['college_id'] ?? '');
$status = trim($_GET['status'] ?? '');

// Build dynamic secure SQL query
$query = "
    SELECT e.*, c.name AS college_name, c.code AS college_code, d.name AS dept_name 
    FROM employees e
    LEFT JOIN colleges c ON e.college_id = c.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE 1=1
";
$params = [];

if ($search !== '') {
    $query .= " AND (e.employee_id LIKE :search OR e.first_name LIKE :search OR e.father_name LIKE :search OR e.email LIKE :search OR e.position LIKE :search)";
    $params[':search'] = "%{$search}%";
}
if ($category !== '') {
    $query .= " AND e.staff_category = :category";
    $params[':category'] = $category;
}
if ($college_id !== '') {
    $query .= " AND e.college_id = :college_id";
    $params[':college_id'] = $college_id;
}
if ($status !== '') {
    $query .= " AND e.status = :status";
    $params[':status'] = $status;
}

$query .= " ORDER BY e.id DESC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$employees = $stmt->fetchAll();

// Fetch colleges for dropdown
$colleges = $pdo->query("SELECT id, code, name FROM colleges ORDER BY name ASC")->fetchAll();

require_once APP_ROOT . '/includes/header.php';
require_once APP_ROOT . '/includes/sidebar.php';
?>

<div class="main-content flex-grow-1 d-flex flex-column min-vh-100" style="background-color: #f8fafc;">
    <?php require_once APP_ROOT . '/includes/navbar.php'; ?>

    <div class="container-fluid p-4">
        <?= display_flash() ?>

        <!-- Page Header -->
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
                <h4 class="fw-bold mb-1 text-dark">Employee Management Registry</h4>
                <p class="text-muted small mb-0">Academic & Administrative personnel roster &middot; Borana University</p>
            </div>
            <?php if (has_role(['super_admin', 'hr_admin'])): ?>
            <a href="create.php" class="btn btn-bu-navy text-white shadow-sm">
                <i class="bi bi-person-plus-fill me-1"></i> Register New Employee
            </a>
            <?php endif; ?>
        </div>

        <!-- Module 6: Search & Filter Box -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-3">
                <form method="GET" action="index.php" class="row g-2 align-items-center">
                    <div class="col-md-4">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
                            <input type="text" name="search" class="form-control" placeholder="Search by ID, name, email or position..." value="<?= e($search) ?>">
                        </div>
                    </div>
                    <div class="col-md-2">
                        <select name="category" class="form-select form-select-sm">
                            <option value="">All Staff Categories</option>
                            <option value="academic" <?= $category === 'academic' ? 'selected' : '' ?>>Academic Faculty</option>
                            <option value="administrative" <?= $category === 'administrative' ? 'selected' : '' ?>>Administrative Staff</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <select name="college_id" class="form-select form-select-sm">
                            <option value="">All Colleges</option>
                            <?php foreach ($colleges as $c): ?>
                                <option value="<?= $c['id'] ?>" <?= $college_id == $c['id'] ? 'selected' : '' ?>>
                                    <?= e($c['code']) ?> - <?= e($c['name']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <select name="status" class="form-select form-select-sm">
                            <option value="">All Statuses</option>
                            <option value="active" <?= $status === 'active' ? 'selected' : '' ?>>Active</option>
                            <option value="on_leave" <?= $status === 'on_leave' ? 'selected' : '' ?>>On Leave</option>
                            <option value="suspended" <?= $status === 'suspended' ? 'selected' : '' ?>>Suspended</option>
                            <option value="retired" <?= $status === 'retired' ? 'selected' : '' ?>>Retired</option>
                        </select>
                    </div>
                    <div class="col-md-1 d-flex gap-1">
                        <button type="submit" class="btn btn-sm btn-primary w-100">Filter</button>
                        <a href="index.php" class="btn btn-sm btn-outline-secondary" title="Clear Filters"><i class="bi bi-x"></i></a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Employees Table -->
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <span class="fw-semibold text-secondary small">Total Records Found: <strong><?= count($employees) ?></strong></span>
                <button onclick="window.print()" class="btn btn-sm btn-outline-secondary"><i class="bi bi-printer me-1"></i> Print Table</button>
            </div>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Full Name & Position</th>
                            <th>Staff Category</th>
                            <th>College & Department</th>
                            <th>Qualification</th>
                            <th>Status</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($employees)): ?>
                            <tr><td colspan="7" class="text-center py-5 text-muted">No employees found matching the filter criteria.</td></tr>
                        <?php else: ?>
                            <?php foreach ($employees as $emp): ?>
                            <tr>
                                <td class="font-mono fw-bold text-bu-navy"><?= e($emp['employee_id']) ?></td>
                                <td>
                                    <div class="fw-bold text-dark"><?= e($emp['first_name'] . ' ' . $emp['father_name'] . ' ' . $emp['grandfather_name']) ?></div>
                                    <small class="text-muted"><?= e($emp['position']) ?></small>
                                </td>
                                <td>
                                    <?php if ($emp['staff_category'] === 'academic'): ?>
                                        <span class="badge badge-academic"><i class="bi bi-mortarboard me-1"></i>Academic</span>
                                        <?php if (!empty($emp['academic_rank'])): ?>
                                            <div class="text-muted small mt-0.5"><?= e($emp['academic_rank']) ?></div>
                                        <?php endif; ?>
                                    <?php else: ?>
                                        <span class="badge badge-admin"><i class="bi bi-briefcase me-1"></i>Administrative</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <div class="text-dark small fw-medium"><?= e($emp['dept_name'] ?? 'N/A') ?></div>
                                    <small class="text-muted"><?= e($emp['college_name'] ?? '') ?></small>
                                </td>
                                <td>
                                    <span class="badge bg-light text-dark border"><?= e($emp['qualification']) ?></span>
                                    <div class="text-muted small"><?= e($emp['specialization'] ?? '') ?></div>
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
                                <td class="text-end">
                                    <div class="btn-group btn-group-sm">
                                        <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#viewModal<?= $emp['id'] ?>" title="View Details">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                        <?php if (has_role(['super_admin', 'hr_admin'])): ?>
                                        <a href="index.php?action=delete&id=<?= $emp['id'] ?>" class="btn btn-outline-danger" onclick="return confirm('Are you sure you want to permanently delete employee <?= e($emp['employee_id']) ?>?');" title="Delete">
                                            <i class="bi bi-trash"></i>
                                        </a>
                                        <?php endif; ?>
                                    </div>

                                    <!-- Employee Detail Modal -->
                                    <div class="modal fade" id="viewModal<?= $emp['id'] ?>" tabindex="-1" aria-hidden="true">
                                        <div class="modal-dialog modal-lg text-start">
                                            <div class="modal-content">
                                                <div class="modal-header bg-bu-navy text-white">
                                                    <h5 class="modal-title fw-bold">Employee Profile: <?= e($emp['employee_id']) ?></h5>
                                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                                </div>
                                                <div class="modal-body p-4">
                                                    <div class="row g-3">
                                                        <div class="col-md-6">
                                                            <label class="text-muted small">Full Name:</label>
                                                            <div class="fw-bold"><?= e($emp['first_name'] . ' ' . $emp['father_name'] . ' ' . $emp['grandfather_name']) ?></div>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <label class="text-muted small">Gender:</label>
                                                            <div class="fw-medium"><?= e($emp['gender']) ?></div>
                                                        </div>
                                                        <div class="col-md-3">
                                                            <label class="text-muted small">Date of Birth:</label>
                                                            <div class="fw-medium"><?= e($emp['date_of_birth']) ?></div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="text-muted small">Institutional Email:</label>
                                                            <div class="font-mono text-primary"><?= e($emp['email']) ?></div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="text-muted small">Phone Number:</label>
                                                            <div class="font-mono"><?= e($emp['phone']) ?></div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="text-muted small">College:</label>
                                                            <div class="fw-bold"><?= e($emp['college_name'] ?? '') ?></div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="text-muted small">Department:</label>
                                                            <div class="fw-bold"><?= e($emp['dept_name'] ?? '') ?></div>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label class="text-muted small">Position:</label>
                                                            <div><?= e($emp['position']) ?></div>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label class="text-muted small">Rank / Grade:</label>
                                                            <div><?= e($emp['academic_rank'] ?? 'Administrative') ?></div>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label class="text-muted small">Hire Date:</label>
                                                            <div><?= e($emp['hire_date']) ?></div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="text-muted small">Salary:</label>
                                                            <div class="fw-bold text-success font-mono"><?= format_etb((float)$emp['salary']) ?></div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="text-muted small">Residential Address:</label>
                                                            <div><?= e($emp['address']) ?>, <?= e($emp['city']) ?></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

    </div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
