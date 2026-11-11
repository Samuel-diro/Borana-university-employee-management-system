<?php
/**
 * Module 8: Administrative Reports Generator & Printable Exports
 * Borana University Employee Management System
 */

declare(strict_types=1);
define('APP_ROOT', dirname(__DIR__, 2));

require_once APP_ROOT . '/includes/functions.php';
$pdo = require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/includes/auth.php';

require_role(['super_admin', 'hr_admin'], '../dashboard.php');

$page_title = 'Administrative Reports & Exports';
$current_page = 'reports';

$report_type = trim($_GET['type'] ?? 'employee'); // 'employee' | 'attendance' | 'leave'
$export = trim($_GET['export'] ?? '');

// Handle CSV Export if requested
if ($export === 'csv') {
    if ($report_type === 'employee') {
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="borana_employees_' . date('Y-m-d') . '.csv"');
        $output = fopen('php://output', 'w');
        fputcsv($output, ['ID', 'Full Name', 'Gender', 'Email', 'Phone', 'Staff Category', 'College', 'Department', 'Position', 'Salary', 'Status']);
        
        $stmt = $pdo->query("SELECT e.employee_id, CONCAT(e.first_name, ' ', e.father_name), e.gender, e.email, e.phone, e.staff_category, c.name, d.name, e.position, e.salary, e.status FROM employees e LEFT JOIN colleges c ON e.college_id = c.id LEFT JOIN departments d ON e.department_id = d.id ORDER BY e.id ASC");
        while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
            fputcsv($output, $row);
        }
        fclose($output);
        exit;
    } elseif ($report_type === 'attendance') {
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="borana_attendance_' . date('Y-m-d') . '.csv"');
        $output = fopen('php://output', 'w');
        fputcsv($output, ['Date', 'Employee ID', 'Employee Name', 'Department', 'Check In', 'Check Out', 'Status', 'Remarks']);
        
        $stmt = $pdo->query("SELECT a.date, a.employee_id, CONCAT(e.first_name, ' ', e.father_name), d.name, a.check_in, a.check_out, a.status, a.remarks FROM attendance a JOIN employees e ON a.employee_id = e.employee_id LEFT JOIN departments d ON e.department_id = d.id ORDER BY a.date DESC, a.employee_id ASC");
        while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
            fputcsv($output, $row);
        }
        fclose($output);
        exit;
    }
}

// Fetch report data based on selected tab
if ($report_type === 'employee') {
    $data = $pdo->query("
        SELECT e.*, c.name AS college_name, d.name AS dept_name
        FROM employees e
        LEFT JOIN colleges c ON e.college_id = c.id
        LEFT JOIN departments d ON e.department_id = d.id
        ORDER BY e.id ASC
    ")->fetchAll();
} elseif ($report_type === 'attendance') {
    $data = $pdo->query("
        SELECT a.*, e.first_name, e.father_name, d.name AS dept_name
        FROM attendance a
        JOIN employees e ON a.employee_id = e.employee_id
        LEFT JOIN departments d ON e.department_id = d.id
        ORDER BY a.date DESC, a.check_in ASC
        LIMIT 100
    ")->fetchAll();
} else {
    $data = $pdo->query("
        SELECT lr.*, lt.name AS leave_type_name, e.first_name, e.father_name, d.name AS dept_name
        FROM leave_requests lr
        JOIN leave_types lt ON lr.leave_type_id = lt.id
        JOIN employees e ON lr.employee_id = e.employee_id
        LEFT JOIN departments d ON e.department_id = d.id
        ORDER BY lr.id DESC
    ")->fetchAll();
}

require_once APP_ROOT . '/includes/header.php';
require_once APP_ROOT . '/includes/sidebar.php';
?>

<div class="main-content flex-grow-1 d-flex flex-column min-vh-100" style="background-color: #f8fafc;">
    <?php require_once APP_ROOT . '/includes/navbar.php'; ?>

    <div class="container-fluid p-4">
        <!-- University Letterhead for Print Mode -->
        <div class="print-only text-center pb-4 mb-4 border-bottom d-none" style="display: none;">
            <h3 class="fw-bold mb-0">BORANA UNIVERSITY</h3>
            <h5>Office of Human Resources & Institutional Information Management</h5>
            <p class="small text-muted mb-0">Official Administrative Audit Report &middot; Generated <?= date('d M Y H:i:s') ?></p>
        </div>

        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 no-print">
            <div>
                <h4 class="fw-bold mb-1 text-dark">Institutional Reports & Analytics</h4>
                <p class="text-muted small mb-0">Module 8: Audit statements, staff census, and attendance ledgers</p>
            </div>
            <div class="d-flex gap-2">
                <a href="index.php?type=<?= e($report_type) ?>&export=csv" class="btn btn-sm btn-outline-success">
                    <i class="bi bi-file-earmark-spreadsheet me-1"></i> Export to CSV
                </a>
                <button onclick="window.print()" class="btn btn-sm btn-bu-navy text-white shadow-sm">
                    <i class="bi bi-printer me-1"></i> Print Official Report (PDF)
                </button>
            </div>
        </div>

        <!-- Report Type Tabs -->
        <div class="card border-0 shadow-sm mb-4 no-print">
            <div class="card-body p-2 d-flex flex-wrap gap-2">
                <a href="index.php?type=employee" class="btn btn-sm <?= $report_type === 'employee' ? 'btn-dark' : 'btn-light border' ?>">
                    <i class="bi bi-people me-1"></i> Employee Master Roll
                </a>
                <a href="index.php?type=attendance" class="btn btn-sm <?= $report_type === 'attendance' ? 'btn-dark' : 'btn-light border' ?>">
                    <i class="bi bi-clock-history me-1"></i> Comprehensive Attendance Audit
                </a>
                <a href="index.php?type=leave" class="btn btn-sm <?= $report_type === 'leave' ? 'btn-dark' : 'btn-light border' ?>">
                    <i class="bi bi-calendar2-check me-1"></i> Leave Applications Ledger
                </a>
            </div>
        </div>

        <!-- Render Report Content -->
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white py-3">
                <h6 class="fw-bold mb-0 text-dark">
                    <?= $report_type === 'employee' ? 'Comprehensive University Employee Master Roll' : ($report_type === 'attendance' ? 'Biometric Attendance Audit Ledger' : 'Staff Leave & Absence Record') ?>
                </h6>
            </div>
            <div class="table-responsive">
                <?php if ($report_type === 'employee'): ?>
                <table class="table table-bordered table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Employee ID</th>
                            <th>Full Name</th>
                            <th>Category</th>
                            <th>College & Department</th>
                            <th>Qualification</th>
                            <th>Hire Date</th>
                            <th>Basic Salary</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($data as $i => $row): ?>
                        <tr>
                            <td><?= $i + 1 ?></td>
                            <td class="font-mono fw-bold"><?= e($row['employee_id']) ?></td>
                            <td class="fw-semibold"><?= e($row['first_name'] . ' ' . $row['father_name'] . ' ' . $row['grandfather_name']) ?></td>
                            <td><?= ucfirst($row['staff_category']) ?></td>
                            <td><?= e($row['college_name'] ?? '') ?> - <?= e($row['dept_name'] ?? '') ?></td>
                            <td><?= e($row['qualification']) ?></td>
                            <td><?= e($row['hire_date']) ?></td>
                            <td class="font-mono text-end"><?= format_etb((float)$row['salary']) ?></td>
                            <td><span class="badge bg-light text-dark border"><?= ucfirst($row['status']) ?></span></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                <?php elseif ($report_type === 'attendance'): ?>
                <table class="table table-bordered table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Check-In</th>
                            <th>Check-Out</th>
                            <th>Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($data as $row): ?>
                        <tr>
                            <td class="font-mono"><?= e($row['date']) ?></td>
                            <td class="font-mono fw-bold"><?= e($row['employee_id']) ?></td>
                            <td><?= e($row['first_name'] . ' ' . $row['father_name']) ?></td>
                            <td><?= e($row['dept_name'] ?? '') ?></td>
                            <td class="font-mono"><?= e($row['check_in'] ?? '--:--') ?></td>
                            <td class="font-mono"><?= e($row['check_out'] ?? '--:--') ?></td>
                            <td><span class="badge bg-light text-dark border"><?= ucfirst($row['status']) ?></span></td>
                            <td><small><?= e($row['remarks'] ?? '-') ?></small></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                <?php else: ?>
                <table class="table table-bordered table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Ref</th>
                            <th>Staff Member</th>
                            <th>Department</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($data as $row): ?>
                        <tr>
                            <td class="font-mono">#LR-<?= sprintf('%03d', $row['id']) ?></td>
                            <td class="fw-semibold"><?= e($row['first_name'] . ' ' . $row['father_name']) ?> (<?= e($row['employee_id']) ?>)</td>
                            <td><?= e($row['dept_name'] ?? '') ?></td>
                            <td><?= e($row['leave_type_name']) ?></td>
                            <td><?= e($row['start_date']) ?></td>
                            <td><?= e($row['end_date']) ?></td>
                            <td class="font-mono fw-bold"><?= (int)$row['days_requested'] ?></td>
                            <td><span class="badge bg-light text-dark border"><?= ucfirst($row['status']) ?></span></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                <?php endif; ?>
            </div>
        </div>

    </div>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
