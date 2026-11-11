<?php
/**
 * Module 4: Employee Attendance Management
 * Borana University Employee Management System
 */

declare(strict_types=1);
define('APP_ROOT', dirname(__DIR__, 2));

require_once APP_ROOT . '/includes/functions.php';
$pdo = require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/includes/auth.php';

require_login('../../auth/login.php');

$page_title = 'Attendance Management';
$current_page = 'attendance';

$filter_date = trim($_GET['date'] ?? date('Y-m-d'));
$search = trim($_GET['search'] ?? '');
$status_filter = trim($_GET['status'] ?? '');

// Handle Quick Attendance Punch / Record
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'record_attendance') {
    if (validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $emp_id = trim($_POST['employee_id'] ?? '');
        $date = trim($_POST['date'] ?? date('Y-m-d'));
        $check_in = !empty($_POST['check_in']) ? trim($_POST['check_in']) : null;
        $check_out = !empty($_POST['check_out']) ? trim($_POST['check_out']) : null;
        $status = trim($_POST['status'] ?? 'present');
        $remarks = trim($_POST['remarks'] ?? '');

        if (!empty($emp_id)) {
            $stmt = $pdo->prepare("
                INSERT INTO attendance (employee_id, date, check_in, check_out, status, remarks)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    check_in = VALUES(check_in),
                    check_out = VALUES(check_out),
                    status = VALUES(status),
                    remarks = VALUES(remarks)
            ");
            $stmt->execute([$emp_id, $date, $check_in, $check_out, $status, $remarks]);
            log_activity($pdo, 'Record Attendance', "Updated attendance for {$emp_id} on {$date} ({$status})");
            set_flash('success', "Attendance record for {$emp_id} successfully saved.");
            header("Location: index.php?date={$date}");
            exit;
        }
    }
}

// Fetch Attendance Logs for Date
$query = "
    SELECT a.*, e.first_name, e.father_name, e.staff_category, d.name AS dept_name
    FROM attendance a
    JOIN employees e ON a.employee_id = e.employee_id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE a.date = :date
";
$params = [':date' => $filter_date];

if ($search !== '') {
    $query .= " AND (a.employee_id LIKE :search OR e.first_name LIKE :search OR e.father_name LIKE :search)";
    $params[':search'] = "%{$search}%";
}
if ($status_filter !== '') {
    $query .= " AND a.status = :status";
    $params[':status'] = $status_filter;
}

$query .= " ORDER BY a.check_in ASC, e.first_name ASC";
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$attendance_records = $stmt->fetchAll();

// Attendance Summary Stats for Date
$summary_stmt = $pdo->prepare("
    SELECT 
        COUNT(*) AS total_recorded,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) AS late_count,
        SUM(CASE WHEN status = 'half_day' THEN 1 ELSE 0 END) AS half_day_count,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) AS absent_count
    FROM attendance 
    WHERE date = ?
");
$summary_stmt->execute([$filter_date]);
$summary = $summary_stmt->fetch();

// Employee list for modal selection
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
                <h4 class="fw-bold mb-1 text-dark">Staff Attendance Tracking</h4>
                <p class="text-muted small mb-0">Module 4: Daily biometric check-in, presence, and punctuality audit</p>
            </div>
            <?php if (has_role(['super_admin', 'hr_admin', 'department_head'])): ?>
            <button class="btn btn-bu-navy text-white shadow-sm" data-bs-toggle="modal" data-bs-target="#recordModal">
                <i class="bi bi-clock-history me-1"></i> Manual Attendance Entry
            </button>
            <?php endif; ?>
        </div>

        <!-- Date & Status Filter Bar -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-3">
                <form method="GET" action="index.php" class="row g-2 align-items-center">
                    <div class="col-md-3">
                        <label class="small text-muted fw-semibold">Attendance Date:</label>
                        <input type="date" name="date" class="form-control form-control-sm font-mono" value="<?= e($filter_date) ?>" onchange="this.form.submit()">
                    </div>
                    <div class="col-md-4">
                        <label class="small text-muted fw-semibold">Search Employee:</label>
                        <input type="text" name="search" class="form-control form-control-sm" placeholder="ID or staff name..." value="<?= e($search) ?>">
                    </div>
                    <div class="col-md-3">
                        <label class="small text-muted fw-semibold">Status:</label>
                        <select name="status" class="form-select form-select-sm">
                            <option value="">All Statuses</option>
                            <option value="present" <?= $status_filter === 'present' ? 'selected' : '' ?>>Present (On-time)</option>
                            <option value="late" <?= $status_filter === 'late' ? 'selected' : '' ?>>Late</option>
                            <option value="half_day" <?= $status_filter === 'half_day' ? 'selected' : '' ?>>Half Day</option>
                            <option value="absent" <?= $status_filter === 'absent' ? 'selected' : '' ?>>Absent</option>
                        </select>
                    </div>
                    <div class="col-md-2 d-flex align-items-end gap-1 mt-auto">
                        <button type="submit" class="btn btn-sm btn-primary w-100">Filter</button>
                        <a href="index.php?date=<?= date('Y-m-d') ?>" class="btn btn-sm btn-outline-secondary" title="Reset Today">Today</a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Daily KPI Summary Cards -->
        <div class="row g-3 mb-4">
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm p-3 text-center">
                    <span class="text-muted small">PRESENT</span>
                    <h3 class="fw-bold mb-0 text-success font-mono"><?= (int)($summary['present_count'] ?? 0) ?></h3>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm p-3 text-center">
                    <span class="text-muted small">LATE ENTRY</span>
                    <h3 class="fw-bold mb-0 text-warning font-mono"><?= (int)($summary['late_count'] ?? 0) ?></h3>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm p-3 text-center">
                    <span class="text-muted small">HALF DAY</span>
                    <h3 class="fw-bold mb-0 text-info font-mono"><?= (int)($summary['half_day_count'] ?? 0) ?></h3>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="card border-0 shadow-sm p-3 text-center">
                    <span class="text-muted small">ABSENT</span>
                    <h3 class="fw-bold mb-0 text-danger font-mono"><?= (int)($summary['absent_count'] ?? 0) ?></h3>
                </div>
            </div>
        </div>

        <!-- Attendance Table -->
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <span class="fw-semibold text-secondary small">Logs for Date: <strong><?= e($filter_date) ?></strong></span>
                <button onclick="window.print()" class="btn btn-sm btn-outline-secondary"><i class="bi bi-printer me-1"></i> Print Daily Sheet</button>
            </div>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Staff Name</th>
                            <th>Department</th>
                            <th>Check-In</th>
                            <th>Check-Out</th>
                            <th>Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($attendance_records)): ?>
                            <tr><td colspan="7" class="text-center py-5 text-muted">No attendance logs found for this date.</td></tr>
                        <?php else: ?>
                            <?php foreach ($attendance_records as $att): ?>
                            <tr>
                                <td class="font-mono fw-bold text-bu-navy"><?= e($att['employee_id']) ?></td>
                                <td>
                                    <div class="fw-semibold text-dark"><?= e($att['first_name'] . ' ' . $att['father_name']) ?></div>
                                    <small class="text-muted"><?= ucfirst($att['staff_category']) ?> Staff</small>
                                </td>
                                <td><span class="small text-secondary"><?= e($att['dept_name'] ?? 'N/A') ?></span></td>
                                <td class="font-mono text-dark fw-medium"><?= e($att['check_in'] ?? '--:--:--') ?></td>
                                <td class="font-mono text-dark fw-medium"><?= e($att['check_out'] ?? '--:--:--') ?></td>
                                <td>
                                    <?php if ($att['status'] === 'present'): ?>
                                        <span class="badge bg-success-subtle text-success">Present</span>
                                    <?php elseif ($att['status'] === 'late'): ?>
                                        <span class="badge bg-warning-subtle text-warning">Late</span>
                                    <?php elseif ($att['status'] === 'half_day'): ?>
                                        <span class="badge bg-info-subtle text-info">Half Day</span>
                                    <?php else: ?>
                                        <span class="badge bg-danger-subtle text-danger">Absent</span>
                                    <?php endif; ?>
                                </td>
                                <td><small class="text-muted"><?= e($att['remarks'] ?? '-') ?></small></td>
                            </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Manual Attendance Entry Modal -->
    <div class="modal fade" id="recordModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form method="POST" action="index.php">
                    <input type="hidden" name="action" value="record_attendance">
                    <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">
                    <div class="modal-header bg-bu-navy text-white">
                        <h5 class="modal-title fw-bold">Manual Attendance Entry</h5>
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
                            <label class="form-label small fw-semibold">Date *</label>
                            <input type="date" name="date" class="form-control" value="<?= date('Y-m-d') ?>" required>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <label class="form-label small fw-semibold">Check In Time</label>
                                <input type="time" name="check_in" class="form-control" value="08:00">
                            </div>
                            <div class="col-6">
                                <label class="form-label small fw-semibold">Check Out Time</label>
                                <input type="time" name="check_out" class="form-control" value="17:00">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Status *</label>
                            <select name="status" class="form-select">
                                <option value="present">Present (On-time)</option>
                                <option value="late">Late</option>
                                <option value="half_day">Half-Day</option>
                                <option value="absent">Absent</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Remarks</label>
                            <input type="text" name="remarks" class="form-control" placeholder="e.g. Field assignment or official duty">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-bu-navy text-white">Save Attendance</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
