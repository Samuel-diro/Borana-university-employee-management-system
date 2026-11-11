-- =====================================================================
-- Borana University Employee Management System - Sample Seed Data
-- =====================================================================

USE `borana_employee_management`;

-- ROLES
INSERT INTO `roles` (`id`, `role_name`, `display_name`, `description`) VALUES
(1, 'super_admin', 'Super Administrator', 'Full system access, configuration, user rights, database audit'),
(2, 'hr_admin', 'HR Administrator', 'Staff registration, personnel files, attendance verification, leave approvals'),
(3, 'department_head', 'Department Head', 'Departmental roster, staff attendance monitoring, leave endorsement'),
(4, 'employee', 'Academic / Administrative Employee', 'Self-service portal, view profile, log attendance, submit leaves');

-- COLLEGES
INSERT INTO `colleges` (`id`, `code`, `name`, `dean_name`, `description`, `established_year`) VALUES
(1, 'CIC', 'College of Informatics and Computing', 'Dr. Tadesse Gemeda (PhD)', 'Excellence in computing, AI, networking and software engineering.', 2018),
(2, 'CBE', 'College of Business and Economics', 'Dr. Aster Bekele (PhD)', 'Finance, macroeconomics, management and business analytics.', 2017),
(3, 'CANR', 'College of Agriculture and Natural Resources', 'Prof. Galgalo Guyo (PhD)', 'Pastoralist systems, dryland agriculture and range resource management.', 2016),
(4, 'CHS', 'College of Health Sciences', 'Dr. Bontu Dida (MD, MPH)', 'Public health, nursing, medicine and epidemiology.', 2019),
(5, 'CET', 'College of Engineering and Technology', 'Eng. Chala Tolosa (MSc)', 'Infrastructure development, civil, mechanical and electrical engineering.', 2020),
(6, 'CSSH', 'College of Social Sciences and Humanities', 'Dr. Liban Wario (PhD)', 'Cultural heritage, Gadaa system studies, sociology and linguistics.', 2017);

-- DEPARTMENTS
INSERT INTO `departments` (`id`, `college_id`, `code`, `name`, `head_name`, `office_location`, `email`, `phone`) VALUES
(1, 1, 'CS', 'Department of Computer Science', 'Samuel Diro (MSc)', 'Block B2, Room 304', 'cs@borana.edu.et', '+251 46 443 0122'),
(2, 1, 'IT', 'Department of Information Technology', 'Yohanis Hailu (MSc)', 'Block B2, Room 310', 'it@borana.edu.et', '+251 46 443 0123'),
(3, 2, 'ACCF', 'Department of Accounting and Finance', 'Wayneshet Mekuria (MA)', 'Block A1, Room 201', 'accounting@borana.edu.et', '+251 46 443 0130'),
(4, 2, 'ECON', 'Department of Economics', 'Tsegaye Tadesse (MSc)', 'Block A1, Room 208', 'economics@borana.edu.et', '+251 46 443 0131'),
(5, 3, 'ANSC', 'Department of Animal and Range Sciences', 'Dr. Boru Guyo (PhD)', 'Agri Complex, Room 102', 'animalscience@borana.edu.et', '+251 46 443 0140'),
(6, 4, 'PUBH', 'Department of Public Health', 'Sister Hawi Jaleta (MPH)', 'Health Science Wing, Room 112', 'publichealth@borana.edu.et', '+251 46 443 0150'),
(7, 5, 'CVLE', 'Department of Civil Engineering', 'Eng. Desta Negash (MSc)', 'Engineering Lab, Room 204', 'civil@borana.edu.et', '+251 46 443 0160'),
(8, 2, 'MGMT', 'Department of Management & Admin', 'Ato Worku Kebede (MBA)', 'Central Admin, Room 105', 'admin@borana.edu.et', '+251 46 443 0101');

-- LEAVE TYPES
INSERT INTO `leave_types` (`id`, `name`, `default_days_per_year`, `is_paid`, `description`) VALUES
(1, 'Annual Leave', 30, 1, 'Paid annual recreational leave per university statute'),
(2, 'Sick Leave', 15, 1, 'Medical illness supported by official health clinic certificate'),
(3, 'Maternity Leave', 90, 1, 'Statutory maternity leave for female personnel'),
(4, 'Emergency Leave', 5, 1, 'Compassionate leave for immediate family emergency'),
(5, 'Study / Sabbatical Leave', 60, 1, 'Authorized academic research or conference travel'),
(6, 'Unpaid Leave', 30, 0, 'Special leave granted without salary retention');

-- EMPLOYEES
INSERT INTO `employees` (`id`, `employee_id`, `first_name`, `father_name`, `grandfather_name`, `gender`, `date_of_birth`, `national_id`, `email`, `phone`, `emergency_contact`, `address`, `city`, `staff_category`, `college_id`, `department_id`, `position`, `academic_rank`, `qualification`, `specialization`, `employment_type`, `hire_date`, `salary`, `status`, `photo_path`) VALUES
(1, 'BU-EMP-001', 'Samuel', 'Diro', 'Tolera', 'Male', '1992-04-14', 'ETH-BOR-99824', 'samuel.diro@borana.edu.et', '+251 91 123 4460', '+251 92 334 1122 (Brother)', 'Faculty Residence Zone 1, Villa 4', 'Yabello', 'academic', 1, 1, 'Lecturer & Department Head', 'Assistant Professor', 'MSc in Computer Science', 'Distributed Systems & Database Engineering', 'Full-Time', '2020-09-01', 24500.00, 'active', 'assets/uploads/samuel_diro.jpg'),
(2, 'BU-EMP-002', 'Wayneshet', 'Mekuria', 'Bekele', 'Female', '1994-08-20', 'ETH-BOR-88310', 'wayneshet.m@borana.edu.et', '+251 91 445 2220', '+251 91 110 9944 (Spouse)', 'Staff Quarters, Block C', 'Yabello', 'administrative', 2, 8, 'Senior Human Resources Director', NULL, 'MA in Human Resource Management', 'Talent Acquisition & Employee Relations', 'Full-Time', '2019-02-15', 26800.00, 'active', 'assets/uploads/wayneshet_m.jpg'),
(3, 'BU-EMP-003', 'Yohanis', 'Hailu', 'Assefa', 'Male', '1991-11-05', 'ETH-BOR-77402', 'yohanis.hailu@borana.edu.et', '+251 92 789 2310', '+251 91 223 3445 (Parent)', 'Campus Gate 2, Building 3', 'Yabello', 'academic', 1, 2, 'Assistant Professor & IT Head', 'Assistant Professor', 'MSc in Information Technology', 'Network Security & Cloud Infrastructure', 'Full-Time', '2019-10-10', 23900.00, 'active', 'assets/uploads/yohanis_h.jpg'),
(4, 'BU-EMP-004', 'Tsegaye', 'Tadesse', 'Dibaba', 'Male', '1993-01-25', 'ETH-BOR-66519', 'tsegaye.tadesse@borana.edu.et', '+251 93 456 3300', '+251 91 887 6655 (Sister)', 'Yabello Town, Kebele 02', 'Yabello', 'academic', 2, 4, 'Lecturer in Economics', 'Lecturer', 'MSc in Development Economics', 'Agricultural Economics & Econometrics', 'Full-Time', '2021-01-15', 19800.00, 'active', 'assets/uploads/tsegaye_t.jpg'),
(5, 'BU-EMP-005', 'Dr. Tadesse', 'Gemeda', 'Oli', 'Male', '1978-06-12', 'ETH-BOR-10023', 'tadesse.gemeda@borana.edu.et', '+251 91 400 9988', '+251 91 199 8877 (Wife)', 'Dean Quarters Villa 1', 'Yabello', 'academic', 1, 1, 'Dean, College of Informatics', 'Associate Professor', 'PhD in Computer Engineering', 'Artificial Intelligence & High Performance Computing', 'Full-Time', '2018-09-01', 34500.00, 'active', 'assets/uploads/dean_cic.jpg'),
(6, 'BU-EMP-006', 'Dr. Bontu', 'Dida', 'Boru', 'Female', '1985-03-18', 'ETH-BOR-33491', 'bontu.dida@borana.edu.et', '+251 91 223 5566', '+251 91 334 7788 (Spouse)', 'Medical Staff Quarters, Villa 6', 'Yabello', 'academic', 4, 6, 'Dean, College of Health Sciences', 'Assistant Professor', 'MD, Master of Public Health', 'Epidemiology & Maternal Health', 'Full-Time', '2019-07-01', 32000.00, 'active', 'assets/uploads/dean_chs.jpg'),
(7, 'BU-EMP-007', 'Prof. Galgalo', 'Guyo', 'Korme', 'Male', '1970-12-04', 'ETH-BOR-00912', 'galgalo.guyo@borana.edu.et', '+251 91 100 2233', '+251 91 200 4455 (Family)', 'Faculty Residential Zone 2', 'Yabello', 'academic', 3, 5, 'Dean & Professor of Animal Science', 'Professor', 'PhD in Dryland Pastoralist Systems', 'Rangeland Ecology & Camel Nutrition', 'Full-Time', '2016-10-01', 39800.00, 'active', 'assets/uploads/dean_canr.jpg'),
(8, 'BU-EMP-008', 'Kuma', 'Bedada', 'Chala', 'Male', '1995-09-30', 'ETH-BOR-55120', 'kuma.bedada@borana.edu.et', '+251 94 567 8901', '+251 91 567 1234 (Uncle)', 'Kebele 01, Yabello', 'Yabello', 'administrative', 1, 1, 'Senior Network Administrator', NULL, 'BSc in Information Systems', 'Campus Backbone & Fiber Optics', 'Full-Time', '2021-04-01', 16500.00, 'active', 'assets/uploads/kuma_b.jpg'),
(9, 'BU-EMP-009', 'Hawani', 'Tolosa', 'Mideksa', 'Female', '1996-05-14', 'ETH-BOR-66234', 'hawani.tolosa@borana.edu.et', '+251 92 445 7789', '+251 91 334 1122 (Mother)', 'Yabello, Kebele 03', 'Yabello', 'administrative', 2, 3, 'Chief Financial Accountant', NULL, 'BA in Accounting & Finance', 'Payroll & University Grant Auditing', 'Full-Time', '2022-03-01', 17200.00, 'on_leave', 'assets/uploads/hawani_t.jpg'),
(10, 'BU-EMP-010', 'Dr. Aster', 'Bekele', 'Girma', 'Female', '1982-10-19', 'ETH-BOR-22091', 'aster.bekele@borana.edu.et', '+251 91 330 4455', '+251 91 220 5566 (Husband)', 'Dean Residence Villa 4', 'Yabello', 'academic', 2, 4, 'Dean, College of Business & Economics', 'Associate Professor', 'PhD in International Finance', 'Macroeconomic Policy & Pastoralist Banking', 'Full-Time', '2017-11-01', 35000.00, 'active', 'assets/uploads/dean_cbe.jpg');

-- USERS (Password is 'password123' for all demo users, hashed using bcrypt)
-- HASH: $2y$10$wT8KzWvE02q9rXFk5g61k.q6fG9pQxZfJt/pM/P5Yp6WqXm7A6X4O (password123)
INSERT INTO `users` (`id`, `employee_id`, `username`, `password_hash`, `role_id`, `email`, `full_name`, `is_active`) VALUES
(1, 'BU-EMP-001', 'superadmin', '$2y$10$eA0X8uK3Keq95Wc7vQ8i1u6zBfD3yWkK3cZ1vQ8i1u6zBfD3yWkK3', 1, 'admin@borana.edu.et', 'Samuel Diro (Super Admin)', 1),
(2, 'BU-EMP-002', 'hradmin', '$2y$10$eA0X8uK3Keq95Wc7vQ8i1u6zBfD3yWkK3cZ1vQ8i1u6zBfD3yWkK3', 2, 'hr@borana.edu.et', 'Wayneshet Mekuria (HR Admin)', 1),
(3, 'BU-EMP-003', 'depthead', '$2y$10$eA0X8uK3Keq95Wc7vQ8i1u6zBfD3yWkK3cZ1vQ8i1u6zBfD3yWkK3', 3, 'yohanis@borana.edu.et', 'Yohanis Hailu (IT Dept Head)', 1),
(4, 'BU-EMP-004', 'employee', '$2y$10$eA0X8uK3Keq95Wc7vQ8i1u6zBfD3yWkK3cZ1vQ8i1u6zBfD3yWkK3', 4, 'tsegaye@borana.edu.et', 'Tsegaye Tadesse (Staff)', 1);

-- ATTENDANCE SAMPLES
INSERT INTO `attendance` (`employee_id`, `date`, `check_in`, `check_out`, `status`, `remarks`) VALUES
('BU-EMP-001', CURDATE(), '08:02:14', '17:15:30', 'present', 'Punctual - Terminal 1'),
('BU-EMP-002', CURDATE(), '07:55:40', '17:05:11', 'present', 'Early arrival - Central Admin'),
('BU-EMP-003', CURDATE(), '08:24:19', '17:30:00', 'late', 'Late 24 mins - Exam proctoring'),
('BU-EMP-004', CURDATE(), '08:10:05', '12:30:00', 'half_day', 'Approved field survey'),
('BU-EMP-005', CURDATE(), '08:00:10', '18:10:20', 'present', 'Senate council meeting'),
('BU-EMP-006', CURDATE(), '07:45:00', '16:45:00', 'present', 'Clinical round supervisor'),
('BU-EMP-007', CURDATE(), '08:05:00', '17:00:00', 'present', 'Department review'),
('BU-EMP-008', CURDATE(), '08:18:22', '17:10:00', 'late', 'Network switch upgrade'),
('BU-EMP-009', CURDATE(), NULL, NULL, 'absent', 'Maternity leave statutory'),
('BU-EMP-010', CURDATE(), '07:58:12', '17:22:00', 'present', 'Regular administrative presence');

-- LEAVE REQUESTS SAMPLES
INSERT INTO `leave_requests` (`employee_id`, `leave_type_id`, `start_date`, `end_date`, `days_requested`, `reason`, `status`, `applied_at`, `reviewed_by`, `review_remarks`, `reviewed_at`) VALUES
('BU-EMP-009', 3, '2026-11-01', '2027-01-30', 90, 'Maternity leave under Ethiopian Civil Service statutes.', 'approved', '2026-10-20 09:14:00', 2, 'Approved. Full benefits retained.', '2026-10-21 11:30:00'),
('BU-EMP-004', 1, '2026-11-20', '2026-11-27', 7, 'Annual recreational leave for family gathering.', 'pending', '2026-11-09 14:22:10', NULL, NULL, NULL),
('BU-EMP-008', 4, '2026-11-14', '2026-11-16', 2, 'Urgent family emergency in Moyale border zone.', 'pending', '2026-11-10 16:45:00', NULL, NULL, NULL),
('BU-EMP-003', 5, '2026-12-01', '2026-12-15', 14, 'Cyber defense certification conference in Addis Ababa.', 'approved', '2026-10-25 10:10:00', 1, 'Approved for university faculty skill development.', '2026-10-26 14:00:00');

-- ACTIVITY LOGS SAMPLES
INSERT INTO `activity_logs` (`user_id`, `username`, `user_role`, `action`, `details`, `ip_address`, `created_at`) VALUES
(1, 'superadmin', 'Super Administrator', 'System Setup', 'Created database schema and assigned Group 3 credentials', '127.0.0.1', NOW() - INTERVAL 4 HOUR),
(2, 'hradmin', 'HR Administrator', 'Staff Enrollment', 'Registered new employee record BU-EMP-010 Dr. Aster Bekele', '127.0.0.1', NOW() - INTERVAL 3 HOUR),
(3, 'depthead', 'Department Head', 'Attendance Verification', 'Logged daily attendance verification for IT department', '127.0.0.1', NOW() - INTERVAL 2 HOUR),
(4, 'employee', 'Employee', 'Leave Application', 'Submitted annual leave request (7 days)', '127.0.0.1', NOW() - INTERVAL 1 HOUR);
