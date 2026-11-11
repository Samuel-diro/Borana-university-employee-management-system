# Web-Based Employee Management System for Borana University

**Institution:** Borana University  
**Project Group:** Group 3  
**Project Date:** November 2026  

### Group Members:
| No. | Full Name | ID Number | Role |
|:---|:---|:---|:---|
| 1 | **Samuel Diro** | **446** | Project Lead & Full-Stack Developer |
| 2 | **Yohanis Hailu** | **231** | Database Architect & Backend Engineer |
| 3 | **Wayneshet Mekuria** | **222** | HR Domain Analyst & Security Engineer |
| 4 | **Tsegaye Tadesse** | **330** | UI/UX Designer & Frontend Developer |

---

## 1. System Overview & Architecture

The **Web-Based Employee Management System for Borana University** is a centralized, secure institutional platform developed to modernize human capital administration across academic and administrative wings.

### Technology Stack:
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3, Bootstrap Icons, Plus Jakarta Sans & JetBrains Mono typography.
- **Backend:** PHP 8+ (Pure Object-Oriented PDO, prepared statements, CSRF protection, session hardening).
- **Database:** MySQL 8+ / MariaDB (Normalized 3NF relational schema with foreign key constraints).
- **Server:** Apache HTTP Server on XAMPP.

---

## 2. Implemented Modules (All 8 Requirements Met)

1. **Module 1: Employee Registration & Profile Management**
   - Auto-generated sequential Employee IDs (`BU-EMP-001`, `BU-EMP-002`, ...).
   - Multi-tab registration storing personal info, contact, academic qualifications, and emergency contacts.
   - Photograph upload validation.
   - Full profile views with printable institutional ID card layouts.
2. **Module 2: Academic & Administrative Staff Management**
   - Distinct categorization between Academic Faculty and Administrative Staff.
   - Academic ranks (Professor, Associate Professor, Assistant Professor, Lecturer, Graduate Assistant).
   - Departmental and college assignment matrices.
3. **Module 3: College and Department Management**
   - Multi-college catalog with Dean appointments and founding years.
   - Department directory linked via foreign key cascades with Head of Department assignments.
4. **Module 4: Employee Attendance Management**
   - Biometric and manual punch logs (Check-in, Check-out, Time tracking).
   - Status tracking: `present`, `late`, `absent`, `half_day`.
   - Date pickers, employee lookup, and daily aggregate attendance KPIs.
5. **Module 5: Leave Request & Approval Management**
   - Leave submission portal: Annual, Sick, Maternity, Emergency, and Study/Sabbatical.
   - Approval/rejection workflow with administrative audit comments.
6. **Module 6: Employee Record Search & Retrieval**
   - Real-time search by Employee ID, full name, email, or position.
   - Multi-parameter filtering by College, Department, Category, and Employment Status.
7. **Module 7: User Authentication & Role-Based Access Control (RBAC)**
   - 4 Role tiers: `Super Administrator`, `HR Administrator`, `Department Head`, and `Employee`.
   - Password encryption using `password_hash()` (BCRYPT) and verification via `password_verify()`.
   - Session fixation prevention via `session_regenerate_id(true)`.
   - CSRF token verification on all POST operations.
8. **Module 8: Administrative Dashboard & Report Generation**
   - Real-time university KPI counters (Total workforce, faculty vs staff, today's attendance rate, pending leave queue).
   - Audit trail activity logging with client IP tracking.
   - Printable reports with official Borana University letterhead.
   - Direct CSV export for Excel analysis.

---

## 3. Database Schema & Tables

The normalized database `borana_employee_management` contains 10 relational tables:
1. `roles`: Defines system permission tiers.
2. `colleges`: Academic faculties (CIC, CBE, CANR, CHS, CET, CSSH).
3. `departments`: Departments linked to colleges via `college_id`.
4. `positions`: University job titles and salary brackets.
5. `employees`: Core workforce records with 24 columns.
6. `users`: Authentication credentials with foreign key to `roles` and `employees`.
7. `attendance`: Daily punch logs with unique constraint on `(employee_id, date)`.
8. `leave_types`: University statutory leave categories and quotas.
9. `leave_requests`: Applied leaves with reviewer audit trail.
10. `activity_logs`: System audit trail recording IP and administrative actions.

---

## 4. XAMPP Installation & Setup Instructions

1. **Install XAMPP:**
   - Download XAMPP for Windows/Linux from [Apache Friends](https://www.apachefriends.org/).
   - Ensure **Apache** and **MySQL** services are running in XAMPP Control Panel.

2. **Deploy Application Files:**
   - Copy the entire folder `borana-employee-management` into your XAMPP web root:
     - Windows: `C:\xampp\htdocs\borana-employee-management\`
     - Linux: `/opt/lampp/htdocs/borana-employee-management/`

3. **Import Database:**
   - Open your web browser and go to `http://localhost/phpmyadmin`
   - Click **New** and create a database named: `borana_employee_management`
   - Click the **Import** tab:
     - First, import `database/database.sql`
     - Second, import `database/sample_data.sql`

4. **Run Application:**
   - Open your browser to:
     `http://localhost/borana-employee-management/`
   - You will be greeted by the Institutional Login Portal.

---

## 5. Demonstration Accounts for Evaluation

| Role | Username | Password | Linked Staff Profile |
|:---|:---|:---|:---|
| **Super Administrator** | `superadmin` | `password123` | Samuel Diro (CS Dept Head) |
| **HR Administrator** | `hradmin` | `password123` | Wayneshet Mekuria (HR Director) |
| **Department Head** | `depthead` | `password123` | Yohanis Hailu (IT Dept Head) |
| **Academic Employee** | `employee` | `password123` | Tsegaye Tadesse (Economics Lecturer) |

---

## 6. Visual Studio Code Customization Guide

You can open this folder directly in **Visual Studio Code** (`File > Open Folder... > borana-employee-management`).

### How to Change Properties in VS Code:
1. **Change University Branding, Group Members & Colors:**
   - Open file: `config/app.php`
   - Modify any property such as `institution_name`, `motto`, `academic_year`, `project_group`, or the `group_members` array.
   - Adjust theme colors in the `theme` array (e.g. `'primary_color' => '#0a2540'`).
2. **Change Database Credentials:**
   - Open file: `config/database.php`
   - Modify `$db_host`, `$db_port`, `$db_name`, `$db_user`, or `$db_pass`.
3. **Change Styling & CSS:**
   - Open file: `assets/css/style.css`
   - Modify CSS Custom Properties or layout classes directly.
4. **Change Client-Side JavaScript:**
   - Open file: `assets/js/main.js`
   - Add custom client-side validation or table behavior without any npm build step.
5. **Change SQL Schema or Seed Records:**
   - Open file: `database/database.sql` and `database/sample_data.sql`
   - Re-import in phpMyAdmin whenever you modify the structure.
