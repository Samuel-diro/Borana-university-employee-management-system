<?php
/**
 * Module 5: Leave Request & Approval Management
 * Borana University Employee Management System
 */

declare(strict_types=1);
define('APP_ROOT', dirname(__DIR__, 2));

require_once APP_ROOT . '/includes/functions.php';
$pdo = require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/includes/auth.php';

require_login('../../auth/login.php');

$page_title = 'Leave Applications & Approvals';
$current_page = 'leaves';
$user = current_user();

// Handle Approval / Rejection Action
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && in_array($_POST['action'], ['approve', 'reject'], true)) {
    if (validate_csrf_token($_POST['csrf_token'] ?? '')) {
        if (has_role(['super_admin', 'hr_admin', 'department_head'])) {
            $req_id = (int)($_POST['request_id'] ?? 0);
            $new_status = ($_POST['action'] === 'approve') ? 'approved' : 'rejected';
            $remarks = trim($_POST['review_remarks'] ?? '');

            $stmt = $pdo->prepare("
                UPDATE leave_requests 
                SET status = ?, reviewed_by = ?, review_remarks = ?, reviewed_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([$new_status, $user['id'], $remarks, $req_id]);

            // If approved, optionally update employee status to on_leave if start date is current
            if ($new_status === 'approved') {
                $emp_stmt = $pdo->prepare("SELECT employee_id, start_date, end_date FROM leave_requests WHERE id = ?");
                $emp_stmt->execute([$req_id]);
                $lr = $emp_stmt->fetch();
                if ($lr && $lr['start_date'] <= date('Y-m-d') && $lr['end_date'] >= date('Y-m-d')) {
                    $pdo->prepare("UPDATE employees SET status = 'on_leave' WHERE employee_id = ?")->execute([$lr['employee_id']]);
                }
            }

            log_activity($pdo, 'Review Leave', "{$new_status} leave application #{$req_id}");
            set_flash('success', "Leave application #{$req_id} was successfully marked as " . strtoupper($new_status) . ".");
            header("Location: index.php");
            exit;
        }
    }
}

// Handle Submit New Leave Request (For Employee or Admin on behalf of employee)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'apply') {
    if (validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $emp_id = trim($_POST['employee_id'] ?? '');
        $leave_type_id = (int)($_POST['leave_type_id'] ?? 1);
        $start_date = trim($_POST['start_date'] ?? '');
        $end_date = trim($_POST['end_date'] ?? '');
        $days = (int)($_POST['days_requested'] ?? 1);
        $reason = trim($_POST['reason'] ?? '');

        if (!empty($emp_id) && !empty($start_date) && !empty($end_date)) {
            $stmt = $pdo->prepare("
                INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, days_requested, reason, status)
                VALUES (?, ?, ?, ?, ?, ?, 'pending')
            ");
            $stmt->execute([$emp_id, $leave_type_id, $start_date, $end_date, $days, $reason]);
            log_activity($pdo, 'Submit Leave', "Submitted leave request for {$emp_id} ({$days} days)");
            set_flash('success', "Leave request for {$days} days submitted successfully.");
            header("Location: index.php");
            exit;
        }
    }
}

// Filter Status
$status_filter = trim($_GET['status'] ?? '');
$query = "
    SELECT lr.*, lt.name AS leave_type_name, e.first_name, e.father_name, d.name AS dept_name,
        u.full_name AS reviewer_name
    FROM leave_requests lr
    JOIN leave_types lt ON lr.leave_type_id = lt.id
    JOIN employees e ON lr.employee_id = e.employee_id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN users u ON lr.reviewed_by = u.id
    WHERE 1=1
";
$params = [];
if ($status_filter !== '') {
    $query .= " AND lr.status = :status";
    $params[':status'] = $status_filter;
}
$query .= " ORDER BY lr.id DESC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$leave_requests = $stmt->fetchAll();

$leave_types = $pdo->query("SELECT * FROM leave_types ORDER BY id ASC")->fetchAll();
$all_employees = $pdo->query("SELECT employee_id, first_name, father_name FROM employees ORDER BY first_name ASC")->fetchAll();
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
                <h4 class="fw-bold mb-1 text-dark">Leave Requests & Approvals</h4>
                <p class="text-muted small mb-0">Module 5: Annual, sick, maternity, and emergency leave management</p>
            </div>
            <button class="btn btn-bu-navy text-white shadow-sm" data-bs-toggle="modal" data-bs-target="#applyLeaveModal">
                <i class="bi bi-calendar-plus me-1"></i> Apply for Leave
            </button>
        </div>

        <!-- Filter Segmented Tabs -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-2 d-flex flex-wrap gap-2">
                <a href="index.php" class="btn btn-sm <?= $status_filter === '' ? 'btn-dark' : 'btn-light border' ?>">
                    All Requests
                </a>
                <a href="index.php?status=pending" class="btn btn-sm <?= $status_filter === 'pending' ? 'btn-warning text-dark' : 'btn-light border' ?>">
                    Pending Review
                </a>
                <a href="index.php?status=approved" class="btn btn-sm <?= $status_filter === 'approved' ? 'btn-success' : 'btn-light border' ?>">
                    Approved
                </a>
                <a href="index.php?status=rejected" class="btn btn-sm <?= $status_filter === 'rejected' ? 'btn-danger' : 'btn-light border' ?>">
                    Rejected
                </a>
            </div>
        </div>

        <!-- Leave Requests Table -->
        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Ref #</th>
                            <th>Staff Member</th>
                            <th>Leave Type</th>
                            <th>Duration & Dates</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Review Info</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($leave_requests)): ?>
                            <tr><td colspan="8" class="text-center py-5 text-muted">No leave applications found for this filter.</td></tr>
                        <?php else: ?>
                            <?php foreach ($leave_requests as $lr): ?>
                            <tr>
                                <td class="font-mono text-muted small">#LR-<?= sprintf('%03d', $lr['id']) ?></td>
                                <td>
                                    <div class="fw-bold text-dark"><?= e($lr['first_name'] . ' ' . $lr['father_name']) ?></div>
                                    <span class="font-mono small text-muted"><?= e($lr['employee_id']) ?></span>
                                    <div class="text-secondary small"><?= e($lr['dept_name'] ?? '') ?></div>
                                </td>
                                <td>
                                    <span class="badge bg-light text-dark border"><?= e($lr['leave_type_name']) ?></span>
                                </td>
                                <td>
                                    <div class="fw-bold text-dark font-mono"><?= (int)$lr['days_requested'] ?> Days</div>
                                    <small class="text-muted"><?= e($lr['start_date']) ?> to <?= e($lr['end_date']) ?></small>
                                </td>
                                <td>
                                    <div class="small text-dark" style="max-width: 250px;"><?= e($lr['reason']) ?></div>
                                </td>
                                <td>
                                    <?php if ($lr['status'] === 'pending'): ?>
                                        <span class="badge bg-warning text-dark">Pending</span>
                                    <?php elseif ($lr['status'] === 'approved'): ?>
                                        <span class="badge bg-success">Approved</span>
                                    <?php else: ?>
                                        <span class="badge bg-danger">Rejected</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if (!empty($lr['reviewer_name'])): ?>
                                        <small class="d-block text-dark fw-medium">By: <?= e($lr['reviewer_name']) ?></small>
                                        <small class="text-muted fst-italic">"<?= e($lr['review_remarks'] ?? '') ?>"</small>
                                    <?php else: ?>
                                        <span class="text-muted small fst-italic">Awaiting Review</span>
                                    <?php endif; ?>
                                </td>
                                <td class="text-end">
                                    <?php if ($lr['status'] === 'pending' && has_role(['super_admin', 'hr_admin', 'department_head'])): ?>
                                        <div class="btn-group btn-group-sm">
                                            <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#reviewModal<?= $lr['id'] ?>_approve" title="Approve">
                                                <i class="bi bi-check-lg"></i>
                                            </button>
                                            <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#reviewModal<?= $lr['id'] ?>_reject" title="Reject">
                                                <i class="bi bi-x-lg"></i>
                                            </button>
                                        </div>

                                        <!-- Approve Modal -->
                                        <div class="modal fade" id="reviewModal<?= $lr['id'] ?>_approve" tabindex="-1">
                                            <div class="modal-dialog text-start">
                                                <div class="modal-content">
                                                    <form method="POST" action="index.php">
                                                        <input type="hidden" name="action" value="approve">
                                                        <input type="hidden" name="request_id" value="<?= $lr['id'] ?>">
                                                        <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                                                        <div class="modal-header bg-success text-white">
                                                            <h5 class="modal-title fw-bold">Approve Leave Request #<?= $lr['id'] ?></h5>
                                                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                                        </div>
                                                        <div class="modal-body p-4">
                                                            <p>Approve <strong><?= (int)$lr['days_requested'] ?> days</strong> for <strong><?= e($lr['first_name'] . ' ' . $lr['father_name']) ?></strong> (<?= e($lr['employee_id']) ?>)?</p>
                                                            <div class="mb-3">
                                                                <label class="form-label small fw-semibold">Approval Remarks (Optional)</label>
                                                                <textarea name="review_remarks" class="form-control" rows="2" placeholder="e.g. Endorsed in accordance with statutory policy."></textarea>
                                                            </div>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                            <button type="submit" class="btn btn-success text-white">Confirm Approval</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Reject Modal -->
                                        <div class="modal fade" id="reviewModal<?= $lr['id'] ?>_reject" tabindex="-1">
                                            <div class="modal-dialog text-start">
                                                <div class="modal-content">
                                                    <form method="POST" action="index.php">
                                                        <input type="hidden" name="action" value="reject">
                                                        <input type="hidden" name="request_id" value="<?= $lr['id'] ?>">
                                                        <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                                                        <div class="modal-header bg-danger text-white">
                                                            <h5 class="modal-title fw-bold">Reject Leave Request #<?= $lr['id'] ?></h5>
                                                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                                        </div>
                                                        <div class="modal-body p-4">
                                                            <p>Reject leave application for <strong><?= e($lr['first_name'] . ' ' . $lr['father_name']) ?></strong>?</p>
                                                            <div class="mb-3">
                                                                <label class="form-label small fw-semibold">Reason for Rejection *</label>
                                                                <textarea name="review_remarks" class="form-control" rows="2" placeholder="e.g. Incompatible with critical exam invigilation period." required></textarea>
                                                            </div>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                            <button type="submit" class="btn btn-danger text-white">Confirm Rejection</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>

                                    <?php else: ?>
                                        <span class="text-muted small">&mdash;</span>
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

    <!-- Apply Leave Modal -->
    <div class="modal fade" id="applyLeaveModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form method="POST" action="index.php">
                    <input type="hidden" name="action" value="apply">
                    <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                    <div class="modal-header bg-bu-navy text-white">
                        <h5 class="modal-title fw-bold">Submit Leave Application</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Employee *</label>
                            <select name="employee_id" class="form-select" required>
                                <option value="">Select Employee</option>
                                <?php foreach ($all_employees as $emp): ?>
                                    <option value="<?= e($emp['employee_id']) ?>">
                                        <?= e($emp['employee_id']) ?> - <?= e($emp['first_name'] . ' ' . $emp['father_name']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Leave Category *</label>
                            <select name="leave_type_id" class="form-select" required>
                                <?php foreach ($leave_types as $lt): ?>
                                    <option value="<?= $lt['id'] ?>"><?= e($lt['name']) ?> (Max <?= $lt['default_days_per_year'] ?> days)</option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <label class="form-label small fw-semibold">Start Date *</label>
                                <input type="date" name="start_date" class="form-control" required>
                            </div>
                            <div class="col-6">
                                <label class="form-label small fw-semibold">End Date *</label>
                                <input type="date" name="end_date" class="form-control" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Days Requested *</label>
                            <input type="number" name="days_requested" class="form-control font-mono" min="1" max="180" value="3" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Reason for Leave *</label>
                            <textarea name="reason" class="form-control" rows="3" placeholder="Provide full administrative justification..." required></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-bu-navy text-white">Submit Application</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
