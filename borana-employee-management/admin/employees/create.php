<?php
/**
 * Module 1 & 2: Employee Registration Form & Controller
 * Borana University Employee Management System
 */

declare(strict_types=1);
define('APP_ROOT', dirname(__DIR__, 2));

require_once APP_ROOT . '/includes/functions.php';
$pdo = require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/includes/auth.php';

require_role(['super_admin', 'hr_admin'], 'index.php');

$page_title = 'Register New Employee';
$current_page = 'employees';

$error = '';
$suggested_id = generate_employee_id($pdo);

// Fetch Colleges and Departments
$colleges = $pdo->query("SELECT id, code, name FROM colleges ORDER BY name ASC")->fetchAll();
$departments = $pdo->query("SELECT id, college_id, code, name FROM departments ORDER BY name ASC")->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid security token (CSRF).';
    } else {
        $employee_id = trim($_POST['employee_id'] ?? '');
        $first_name = trim($_POST['first_name'] ?? '');
        $father_name = trim($_POST['father_name'] ?? '');
        $grandfather_name = trim($_POST['grandfather_name'] ?? '');
        $gender = trim($_POST['gender'] ?? 'Male');
        $date_of_birth = trim($_POST['date_of_birth'] ?? '');
        $national_id = trim($_POST['national_id'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $emergency_contact = trim($_POST['emergency_contact'] ?? '');
        $address = trim($_POST['address'] ?? '');
        $city = trim($_POST['city'] ?? 'Yabello');

        $staff_category = trim($_POST['staff_category'] ?? 'academic');
        $college_id = (int) ($_POST['college_id'] ?? 0);
        $department_id = (int) ($_POST['department_id'] ?? 0);
        $position = trim($_POST['position'] ?? '');
        $academic_rank = ($staff_category === 'academic') ? trim($_POST['academic_rank'] ?? '') : null;
        $qualification = trim($_POST['qualification'] ?? '');
        $specialization = trim($_POST['specialization'] ?? '');
        $employment_type = trim($_POST['employment_type'] ?? 'Full-Time');
        $hire_date = trim($_POST['hire_date'] ?? date('Y-m-d'));
        $salary = (float) ($_POST['salary'] ?? 0.0);
        $status = trim($_POST['status'] ?? 'active');

        // Validation
        if (empty($employee_id) || empty($first_name) || empty($father_name) || empty($email) || empty($phone)) {
            $error = 'Please complete all mandatory personal and contact fields.';
        } elseif ($college_id <= 0 || $department_id <= 0) {
            $error = 'Please select a valid College and Department assignment.';
        } else {
            // Check for uniqueness of employee ID or email
            $chk = $pdo->prepare("SELECT COUNT(*) FROM employees WHERE employee_id = ? OR email = ? OR national_id = ?");
            $chk->execute([$employee_id, $email, $national_id]);
            if ($chk->fetchColumn() > 0) {
                $error = 'An employee with this ID, Email, or National ID already exists in the system.';
            } else {
                // File upload handling (optional photo)
                $photo_path = null;
                if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
                    $allowed_types = ['image/jpeg', 'image/png', 'image/webp'];
                    if (in_array($_FILES['photo']['type'], $allowed_types)) {
                        $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
                        $filename = 'emp_' . preg_replace('/[^a-zA-Z0-9]/', '', $employee_id) . '_' . time() . '.' . $ext;
                        $upload_dir = APP_ROOT . '/assets/uploads/';
                        if (!is_dir($upload_dir)) {
                            @mkdir($upload_dir, 0755, true);
                        }
                        if (move_uploaded_file($_FILES['photo']['tmp_name'], $upload_dir . $filename)) {
                            $photo_path = 'assets/uploads/' . $filename;
                        }
                    }
                }

                // Insert into Database
                $stmt = $pdo->prepare("
                    INSERT INTO employees (
                        employee_id, first_name, father_name, grandfather_name, gender, date_of_birth,
                        national_id, email, phone, emergency_contact, address, city,
                        staff_category, college_id, department_id, position, academic_rank,
                        qualification, specialization, employment_type, hire_date, salary, status, photo_path
                    ) VALUES (
                        ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?
                    )
                ");

                $inserted = $stmt->execute([
                    $employee_id, $first_name, $father_name, $grandfather_name, $gender, $date_of_birth,
                    $national_id, $email, $phone, $emergency_contact, $address, $city,
                    $staff_category, $college_id, $department_id, $position, $academic_rank,
                    $qualification, $specialization, $employment_type, $hire_date, $salary, $status, $photo_path
                ]);

                if ($inserted) {
                    log_activity($pdo, 'Register Employee', "Registered employee {$employee_id} ({$first_name} {$father_name})");
                    set_flash('success', "Employee {$employee_id} ({$first_name} {$father_name}) was successfully registered!");
                    header("Location: index.php");
                    exit;
                } else {
                    $error = 'Failed to save employee record. Please verify database constraints.';
                }
            }
        }
    }
}

$csrf_token = generate_csrf_token();
require_once APP_ROOT . '/includes/header.php';
require_once APP_ROOT . '/includes/sidebar.php';
?>

<div class="main-content flex-grow-1 d-flex flex-column min-vh-100" style="background-color: #f8fafc;">
    <?php require_once APP_ROOT . '/includes/navbar.php'; ?>

    <div class="container-fluid p-4">
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div>
                <h4 class="fw-bold mb-1 text-dark">Register New University Employee</h4>
                <p class="text-muted small mb-0">Module 1 & 2: Comprehensive Personnel Enrollment Form</p>
            </div>
            <a href="index.php" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left me-1"></i> Back to Roster
            </a>
        </div>

        <?php if (!empty($error)): ?>
            <div class="alert alert-danger py-2 small mb-4" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> <?= e($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="create.php" enctype="multipart/form-data">
            <input type="hidden" name="csrf_token" value="<?= e($csrf_token) ?>">

            <!-- Section 1: Identification & Personal Info -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-white py-3">
                    <h6 class="fw-bold mb-0 text-dark"><i class="bi bi-person-badge text-primary me-2"></i>1. Personal & Contact Information</h6>
                </div>
                <div class="card-body p-4">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label small fw-semibold">Employee ID *</label>
                            <input type="text" name="employee_id" class="form-control font-mono fw-bold" value="<?= e($suggested_id) ?>" required>
                            <small class="text-muted">Auto-generated sequence</small>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-semibold">First Name *</label>
                            <input type="text" name="first_name" class="form-control" placeholder="e.g. Samuel" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-semibold">Father's Name *</label>
                            <input type="text" name="father_name" class="form-control" placeholder="e.g. Diro" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-semibold">Grandfather's Name *</label>
                            <input type="text" name="grandfather_name" class="form-control" placeholder="e.g. Tolera" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-semibold">Gender *</label>
                            <select name="gender" class="form-select">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-semibold">Date of Birth *</label>
                            <input type="date" name="date_of_birth" class="form-control" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-semibold">National / Kebele ID *</label>
                            <input type="text" name="national_id" class="form-control" placeholder="e.g. ETH-BOR-99824" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label small fw-semibold">Photograph</label>
                            <input type="file" name="photo" class="form-control" accept="image/*">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Institutional Email *</label>
                            <input type="email" name="email" class="form-control" placeholder="username@borana.edu.et" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Phone Number *</label>
                            <input type="text" name="phone" class="form-control" placeholder="+251 91 123 4460" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Emergency Contact</label>
                            <input type="text" name="emergency_contact" class="form-control" placeholder="Name & Phone Number">
                        </div>
                        <div class="col-md-8">
                            <label class="form-label small fw-semibold">Residential Address</label>
                            <input type="text" name="address" class="form-control" placeholder="Faculty Quarters, Kebele 02, etc.">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">City / Town</label>
                            <input type="text" name="city" class="form-control" value="Yabello">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 2: University Assignment & Classification -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-white py-3">
                    <h6 class="fw-bold mb-0 text-dark"><i class="bi bi-briefcase text-primary me-2"></i>2. Academic & Employment Assignment</h6>
                </div>
                <div class="card-body p-4">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Staff Category *</label>
                            <select name="staff_category" id="staff_category" class="form-select" onchange="toggleAcademicFields()">
                                <option value="academic">Academic Faculty</option>
                                <option value="administrative">Administrative Staff</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">College *</label>
                            <select name="college_id" class="form-select" required>
                                <option value="">Select College</option>
                                <?php foreach ($colleges as $c): ?>
                                    <option value="<?= $c['id'] ?>"><?= e($c['code']) ?> - <?= e($c['name']) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Department *</label>
                            <select name="department_id" class="form-select" required>
                                <option value="">Select Department</option>
                                <?php foreach ($departments as $d): ?>
                                    <option value="<?= $d['id'] ?>"><?= e($d['code']) ?> - <?= e($d['name']) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Position / Job Title *</label>
                            <input type="text" name="position" class="form-control" placeholder="e.g. Lecturer, Finance Officer, IT Specialist" required>
                        </div>
                        <div class="col-md-4" id="academic_rank_wrapper">
                            <label class="form-label small fw-semibold">Academic Rank</label>
                            <select name="academic_rank" class="form-select">
                                <option value="Professor">Professor</option>
                                <option value="Associate Professor">Associate Professor</option>
                                <option value="Assistant Professor" selected>Assistant Professor</option>
                                <option value="Lecturer">Lecturer</option>
                                <option value="Assistant Lecturer">Assistant Lecturer</option>
                                <option value="Graduate Assistant">Graduate Assistant</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Highest Educational Qualification *</label>
                            <input type="text" name="qualification" class="form-control" placeholder="e.g. PhD, MSc, MA, BSc, BA" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Area of Specialization</label>
                            <input type="text" name="specialization" class="form-control" placeholder="e.g. Software Engineering, Range Ecology">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Employment Type</label>
                            <select name="employment_type" class="form-select">
                                <option value="Full-Time">Full-Time (Permanent)</option>
                                <option value="Contract">Contract</option>
                                <option value="Part-Time">Part-Time / Adjunct</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Hire Date *</label>
                            <input type="date" name="hire_date" class="form-control" value="<?= date('Y-m-d') ?>" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Monthly Basic Salary (ETB) *</label>
                            <input type="number" step="0.01" name="salary" class="form-control font-mono" placeholder="24000.00" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Employment Status</label>
                            <select name="status" class="form-select">
                                <option value="active" selected>Active</option>
                                <option value="on_leave">On Leave</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="d-flex justify-content-end gap-2 mb-5">
                <a href="index.php" class="btn btn-outline-secondary px-4">Cancel</a>
                <button type="submit" class="btn btn-bu-navy text-white px-5 shadow-sm">
                    <i class="bi bi-check-circle me-1"></i> Save & Register Employee
                </button>
            </div>
        </form>
    </div>

<script>
function toggleAcademicFields() {
    const cat = document.getElementById('staff_category').value;
    const rankWrapper = document.getElementById('academic_rank_wrapper');
    if (cat === 'administrative') {
        rankWrapper.style.display = 'none';
    } else {
        rankWrapper.style.display = 'block';
    }
}
</script>

<?php require_once APP_ROOT . '/includes/footer.php'; ?>
