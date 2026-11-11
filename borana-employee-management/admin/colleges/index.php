<?php
/**
 * Module 3: College Management
 * Borana University Employee Management System
 */

declare(strict_types=1);
define('APP_ROOT', dirname(__DIR__, 2));

require_once APP_ROOT . '/includes/functions.php';
$pdo = require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/includes/auth.php';

require_role(['super_admin', 'hr_admin'], '../dashboard.php');

$page_title = 'Colleges & Faculties';
$current_page = 'colleges';

// Handle Add College
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create') {
    if (validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $code = strtoupper(trim($_POST['code'] ?? ''));
        $name = trim($_POST['name'] ?? '');
        $dean = trim($_POST['dean_name'] ?? '');
        $desc = trim($_POST['description'] ?? '');
        $year = (int) ($_POST['established_year'] ?? 2018);

        if (!empty($code) && !empty($name)) {
            $stmt = $pdo->prepare("INSERT INTO colleges (code, name, dean_name, description, established_year) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$code, $name, $dean, $desc, $year]);
            log_activity($pdo, 'Create College', "Added new college {$code} - {$name}");
            set_flash('success', "College '{$name}' created successfully.");
            header("Location: index.php");
            exit;
        }
    }
}

// Handle Delete
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    $del_id = (int)$_GET['id'];
    try {
        $stmt = $pdo->prepare("DELETE FROM colleges WHERE id = ?");
        $stmt->execute([$del_id]);
        log_activity($pdo, 'Delete College', "Deleted college ID #{$del_id}");
        set_flash('success', 'College was deleted successfully.');
    } catch (PDOException $e) {
        set_flash('danger', 'Cannot delete this college because active departments or employees are currently assigned to it.');
    }
    header("Location: index.php");
    exit;
}

// Fetch all colleges with departmental counts
$colleges = $pdo->query("
    SELECT c.*, 
        COUNT(DISTINCT d.id) AS total_departments,
        COUNT(DISTINCT e.id) AS total_staff
    FROM colleges c
    LEFT JOIN departments d ON d.college_id = c.id
    LEFT JOIN employees e ON e.college_id = c.id
    GROUP BY c.id
    ORDER BY c.name ASC
")->fetchAll();

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
                <h4 class="fw-bold mb-1 text-dark">University Colleges & Faculties</h4>
                <p class="text-muted small mb-0">Module 3: College and academic division administration</p>
            </div>
            <button class="btn btn-bu-navy text-white shadow-sm" data-bs-toggle="modal" data-bs-target="#addCollegeModal">
                <i class="bi bi-plus-lg me-1"></i> Add New College
            </button>
        </div>

        <div class="row g-4">
            <?php foreach ($colleges as $c): ?>
            <div class="col-md-6 col-xl-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body p-4 d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-bu-navy text-white font-mono px-2.5 py-1.5"><?= e($c['code']) ?></span>
                            <small class="text-muted">Est. <?= e((string)$c['established_year']) ?></small>
                        </div>
                        <h5 class="fw-bold text-dark mb-1"><?= e($c['name']) ?></h5>
                        <p class="text-muted small mb-3 flex-grow-1"><?= e($c['description'] ?? 'No description provided.') ?></p>
                        
                        <div class="p-2 bg-light rounded mb-3">
                            <div class="small text-muted">Dean of College:</div>
                            <div class="fw-semibold text-dark small"><?= e($c['dean_name'] ?? 'Not Assigned') ?></div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                            <div class="small text-secondary">
                                <strong><?= (int)$c['total_departments'] ?></strong> Depts &middot; 
                                <strong><?= (int)$c['total_staff'] ?></strong> Staff
                            </div>
                            <a href="index.php?action=delete&id=<?= $c['id'] ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete college <?= e($c['name']) ?>?');">
                                <i class="bi bi-trash"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Add College Modal -->
    <div class="modal fade" id="addCollegeModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form method="POST" action="index.php">
                    <input type="hidden" name="action" value="create">
                    <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                    <div class="modal-header bg-bu-navy text-white">
                        <h5 class="modal-title fw-bold">Create New College</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">College Code *</label>
                            <input type="text" name="code" class="form-control" placeholder="e.g. CIC, CBE, CANR" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">College Name *</label>
                            <input type="text" name="name" class="form-control" placeholder="e.g. College of Health Sciences" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Dean's Name</label>
                            <input type="text" name="dean_name" class="form-control" placeholder="e.g. Dr. Tadesse Gemeda (PhD)">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Established Year</label>
                            <input type="number" name="established_year" class="form-control" value="2020">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Description</label>
                            <textarea name="description" class="form-control" rows="3" placeholder="Brief overview of research and academic focus..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-bu-navy text-white">Save College</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
