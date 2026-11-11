<?php
/**
 * Module 3: Department Management
 * Borana University Employee Management System
 */

declare(strict_types=1);
define('APP_ROOT', dirname(__DIR__, 2));

require_once APP_ROOT . '/includes/functions.php';
$pdo = require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/includes/auth.php';

require_role(['super_admin', 'hr_admin'], '../dashboard.php');

$page_title = 'Academic & Administrative Departments';
$current_page = 'departments';

// Handle Add Department
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create') {
    if (validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $college_id = (int)($_POST['college_id'] ?? 0);
        $code = strtoupper(trim($_POST['code'] ?? ''));
        $name = trim($_POST['name'] ?? '');
        $head = trim($_POST['head_name'] ?? '');
        $office = trim($_POST['office_location'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');

        if ($college_id > 0 && !empty($code) && !empty($name)) {
            $stmt = $pdo->prepare("
                INSERT INTO departments (college_id, code, name, head_name, office_location, email, phone)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$college_id, $code, $name, $head, $office, $email, $phone]);
            log_activity($pdo, 'Create Department', "Created department {$code} - {$name}");
            set_flash('success', "Department '{$name}' created successfully.");
            header("Location: index.php");
            exit;
        }
    }
}

// Handle Delete Department
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    $del_id = (int)$_GET['id'];
    try {
        $stmt = $pdo->prepare("DELETE FROM departments WHERE id = ?");
        $stmt->execute([$del_id]);
        log_activity($pdo, 'Delete Department', "Deleted department ID #{$del_id}");
        set_flash('success', 'Department deleted successfully.');
    } catch (PDOException $e) {
        set_flash('danger', 'Cannot delete this department because staff members are currently assigned to it.');
    }
    header("Location: index.php");
    exit;
}

// Fetch departments with college names and staff counts
$departments = $pdo->query("
    SELECT d.*, c.name AS college_name, c.code AS college_code,
        COUNT(e.id) AS total_staff
    FROM departments d
    JOIN colleges c ON d.college_id = c.id
    LEFT JOIN employees e ON e.department_id = d.id
    GROUP BY d.id
    ORDER BY c.name ASC, d.name ASC
")->fetchAll();

$colleges = $pdo->query("SELECT id, code, name FROM colleges ORDER BY name ASC")->fetchAll();
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
                <h4 class="fw-bold mb-1 text-dark">University Departments</h4>
                <p class="text-muted small mb-0">Module 3: Academic units & administrative department directory</p>
            </div>
            <button class="btn btn-bu-navy text-white shadow-sm" data-bs-toggle="modal" data-bs-target="#addDeptModal">
                <i class="bi bi-plus-lg me-1"></i> Add New Department
            </button>
        </div>

        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Department Name</th>
                            <th>College / Faculty</th>
                            <th>Head of Department</th>
                            <th>Office Location</th>
                            <th>Staff Count</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($departments as $d): ?>
                        <tr>
                            <td class="font-mono fw-bold text-bu-navy"><?= e($d['code']) ?></td>
                            <td>
                                <div class="fw-bold text-dark"><?= e($d['name']) ?></div>
                                <small class="text-muted"><?= e($d['email'] ?? '') ?></small>
                            </td>
                            <td>
                                <span class="badge bg-light text-dark border"><?= e($d['college_code']) ?></span>
                                <small class="text-muted d-block"><?= e($d['college_name']) ?></small>
                            </td>
                            <td>
                                <div class="fw-semibold text-dark small"><?= e($d['head_name'] ?? 'Vacant') ?></div>
                                <small class="text-muted"><?= e($d['phone'] ?? '') ?></small>
                            </td>
                            <td><span class="small text-secondary"><?= e($d['office_location'] ?? 'Main Campus') ?></span></td>
                            <td><span class="badge bg-primary-subtle text-primary font-mono"><?= (int)$d['total_staff'] ?> Staff</span></td>
                            <td class="text-end">
                                <a href="index.php?action=delete&id=<?= $d['id'] ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete department <?= e($d['name']) ?>?');">
                                    <i class="bi bi-trash"></i>
                                </a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Add Department Modal -->
    <div class="modal fade" id="addDeptModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form method="POST" action="index.php">
                    <input type="hidden" name="action" value="create">
                    <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                    <div class="modal-header bg-bu-navy text-white">
                        <h5 class="modal-title fw-bold">Create Department</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Parent College *</label>
                            <select name="college_id" class="form-select" required>
                                <option value="">Select College</option>
                                <?php foreach ($colleges as $c): ?>
                                    <option value="<?= $c['id'] ?>"><?= e($c['code']) ?> - <?= e($c['name']) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Department Code *</label>
                            <input type="text" name="code" class="form-control" placeholder="e.g. CS, IT, ACCF" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Department Name *</label>
                            <input type="text" name="name" class="form-control" placeholder="e.g. Department of Computer Science" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Department Head</label>
                            <input type="text" name="head_name" class="form-control" placeholder="e.g. Samuel Diro (MSc)">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Office Location</label>
                            <input type="text" name="office_location" class="form-control" placeholder="e.g. Block B2, Room 304">
                        </div>
                        <div class="row g-2">
                            <div class="col-6">
                                <label class="form-label small fw-semibold">Contact Email</label>
                                <input type="email" name="email" class="form-control" placeholder="cs@borana.edu.et">
                            </div>
                            <div class="col-6">
                                <label class="form-label small fw-semibold">Phone</label>
                                <input type="text" name="phone" class="form-control" placeholder="+251 46 443 0122">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-bu-navy text-white">Save Department</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
