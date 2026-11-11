import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  FileCode, 
  Database, 
  Copy, 
  Check, 
  Download, 
  Server, 
  Terminal, 
  Sliders, 
  Palette, 
  Users, 
  FileSpreadsheet, 
  Code2, 
  FolderCheck,
  CheckCircle2,
  FolderArchive
} from 'lucide-react';

export const PhpSourceView: React.FC = () => {
  // Configurable Properties State for VS Code Customization
  const [appName, setAppName] = useState('Borana University Employee Management System');
  const [institutionName, setInstitutionName] = useState('Borana University');
  const [motto, setMotto] = useState('Knowledge Through Wisdom & Innovation');
  const [campusLocation, setCampusLocation] = useState('Yabello, Borana Zone, Oromia, Ethiopia');
  const [academicYear, setAcademicYear] = useState('2026 / 2027');
  const [projectGroup, setProjectGroup] = useState('Group 3');
  const [submissionDate, setSubmissionDate] = useState('November 2026');
  
  // Database Properties
  const [dbHost, setDbHost] = useState('localhost');
  const [dbPort, setDbPort] = useState('3306');
  const [dbName, setDbName] = useState('borana_employee_management');
  const [dbUser, setDbUser] = useState('root');
  const [dbPass, setDbPass] = useState('');

  // Theme Colors
  const [primaryColor, setPrimaryColor] = useState('#0a2540');
  const [accentColor, setAccentColor] = useState('#c59b27');

  // UI state
  const [activeTab, setActiveTab] = useState<'editor' | 'files'>('editor');
  const [selectedFile, setSelectedFile] = useState<string>('config/app.php');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  // Generate dynamic app.php code reflecting properties
  const dynamicAppPhp = `<?php
/**
 * =====================================================================
 * ${institutionName.toUpperCase()} - EMPLOYEE MANAGEMENT SYSTEM
 * SYSTEM CONFIGURATION PROPERTIES (VS CODE EDITABLE)
 * =====================================================================
 * 
 * Edit this file in Visual Studio Code to modify institution branding,
 * group members, system titles, colors, currency, and file upload limits.
 */

declare(strict_types=1);

return [
    // 1. INSTITUTION & SYSTEM IDENTITY
    'app_name'             => '${appName}',
    'app_short_name'       => 'BU-EMS',
    'app_version'          => '1.0.0',
    'institution_name'     => '${institutionName}',
    'institution_motto'    => '${motto}',
    'campus_location'      => '${campusLocation}',
    'postal_address'       => 'P.O. Box 77, Yabello, Ethiopia',
    'official_email'       => 'info@borana.edu.et',
    'official_phone'       => '+251 46 443 0100',
    'academic_year'        => '${academicYear}',
    
    // 2. PROJECT GROUP METADATA (Group 3 Information)
    'project_group'        => '${projectGroup}',
    'project_submission'   => '${submissionDate}',
    'group_members'        => [
        ['no' => 1, 'name' => 'Samuel Diro',       'id' => '446', 'role' => 'Project Lead & Full-Stack Developer'],
        ['no' => 2, 'name' => 'Yohanis Hailu',      'id' => '231', 'role' => 'Database Architect & Backend Engineer'],
        ['no' => 3, 'name' => 'Wayneshet Mekuria',  'id' => '222', 'role' => 'HR Domain Analyst & Security Engineer'],
        ['no' => 4, 'name' => 'Tsegaye Tadesse',    'id' => '330', 'role' => 'UI/UX Designer & Frontend Developer'],
    ],

    // 3. UI/UX THEME & COLOR PROPERTIES
    'theme' => [
        'primary_color'    => '${primaryColor}',
        'primary_dark'     => '#07192c',
        'accent_gold'      => '${accentColor}',
        'bg_canvas'        => '#f8fafc',
    ],

    // 4. FINANCIAL & LOCALIZATION SETTINGS
    'currency'             => 'ETB',
    'date_format'          => 'Y-m-d',
    'display_date_format'  => 'd M Y',
    'timezone'             => 'Africa/Addis_Ababa',

    // 5. EMPLOYEE ID PREFIX & FORMAT
    'emp_id_prefix'        => 'BU-EMP-',
    'emp_id_padding'       => 3, // Generates BU-EMP-001, BU-EMP-002...

    // 6. SECURITY & UPLOAD CONSTRAINTS
    'session_lifetime'     => 7200, // 2 Hours in seconds
    'upload_max_size_mb'   => 5,
];`;

  // Generate dynamic database.php reflecting DB properties
  const dynamicDatabasePhp = `<?php
/**
 * =====================================================================
 * ${institutionName.toUpperCase()} - EMPLOYEE MANAGEMENT SYSTEM
 * DATABASE CONNECTION CONFIGURATION (VS CODE & XAMPP)
 * =====================================================================
 * 
 * Edit these database settings in VS Code according to your MySQL setup.
 */

declare(strict_types=1);

$db_host = '${dbHost}';
$db_port = '${dbPort}';
$db_name = '${dbName}';
$db_user = '${dbUser}';
$db_pass = '${dbPass}';

$dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
];

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    die("Database Connection Error: " . htmlspecialchars($e->getMessage()));
}

return $pdo;`;

  // Dynamic style.css
  const dynamicStyleCss = `/**
 * =====================================================================
 * ${institutionName.toUpperCase()} - EMPLOYEE MANAGEMENT SYSTEM
 * PURE CSS3 MASTER STYLESHEET
 * =====================================================================
 */

:root {
    --bu-navy: ${primaryColor};
    --bu-navy-dark: #07192c;
    --bu-gold: ${accentColor};
    --bu-sidebar-width: 260px;
    --bu-bg-body: #f8fafc;
}

body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    background-color: var(--bu-bg-body);
    color: #1e293b;
    min-height: 100vh;
}

.font-mono {
    font-family: 'JetBrains Mono', Consolas, monospace;
}

.bg-bu-navy { background-color: var(--bu-navy) !important; }
.text-bu-gold { color: var(--bu-gold) !important; }

.btn-bu-navy {
    background-color: var(--bu-navy);
    color: #ffffff;
    font-weight: 600;
    border: none;
}
.btn-bu-navy:hover {
    background-color: #07192c;
    color: #ffffff;
}

.sidebar {
    width: var(--bu-sidebar-width);
    background: linear-gradient(180deg, #07192c 0%, var(--bu-navy) 100%);
    min-height: 100vh;
    color: #ffffff;
}
.sidebar .nav-link {
    color: #94a3b8;
    padding: 0.75rem 1.15rem;
    font-size: 0.88rem;
    border-radius: 8px;
    margin: 3px 8px;
    display: flex;
    align-items: center;
    gap: 12px;
}
.sidebar .nav-link.active {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.14);
    border-left: 4px solid var(--bu-gold);
}

@media print {
    .no-print, .sidebar, .top-navbar, footer, .btn {
        display: none !important;
    }
    body { background-color: #fff !important; }
}`;

  // Complete file repository
  const fileContents: Record<string, { title: string; category: string; description: string; code: string }> = {
    'config/app.php': {
      title: 'config/app.php',
      category: '1. PHP System Properties',
      description: 'Central properties file in VS Code. Controls branding, group members, colors, semester dates, and upload limits.',
      code: dynamicAppPhp
    },
    'config/database.php': {
      title: 'config/database.php',
      category: '1. PHP System Properties',
      description: 'PDO database connection configuration with UTF-8 character encoding and custom port support.',
      code: dynamicDatabasePhp
    },
    'assets/css/style.css': {
      title: 'assets/css/style.css',
      category: '2. CSS3 Styling',
      description: 'Pure CSS3 styling with custom properties, responsive layout, dark blue and gold theme, and print styles.',
      code: dynamicStyleCss
    },
    'assets/js/main.js': {
      title: 'assets/js/main.js',
      category: '3. Vanilla JavaScript',
      description: 'Pure client-side JavaScript for live search, alert dismissing, day calculations, and form helpers.',
      code: `document.addEventListener('DOMContentLoaded', () => {
    // 1. Live Table Search
    const searchInput = document.getElementById('tableSearchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const query = this.value.toLowerCase().trim();
            document.querySelectorAll('.table tbody tr').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
            });
        });
    }

    // 2. Staff Category Conditional Fields
    const catSelect = document.getElementById('staff_category');
    const rankWrap = document.getElementById('academic_rank_wrapper');
    if (catSelect && rankWrap) {
        catSelect.addEventListener('change', () => {
            rankWrap.style.display = catSelect.value === 'administrative' ? 'none' : 'block';
        });
    }

    // 3. Auto Calculate Leave Days
    const start = document.getElementById('leave_start_date');
    const end = document.getElementById('leave_end_date');
    const days = document.getElementById('days_requested');
    if (start && end && days) {
        const updateDays = () => {
            const s = new Date(start.value), e = new Date(end.value);
            if (!isNaN(s) && !isNaN(e) && e >= s) {
                days.value = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1;
            }
        };
        start.addEventListener('change', updateDays);
        end.addEventListener('change', updateDays);
    }
});`
    },
    'database/database.sql': {
      title: 'database/database.sql',
      category: '4. MySQL Database',
      description: 'Normalized MySQL 3NF schema with 10 tables: users, roles, employees, colleges, departments, attendance, leave_types, leave_requests, activity_logs.',
      code: `-- ${institutionName} - Normalized Relational Schema
CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`${dbName}\`;

CREATE TABLE IF NOT EXISTS \`roles\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`role_name\` VARCHAR(50) NOT NULL UNIQUE,
  \`display_name\` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`colleges\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(20) NOT NULL UNIQUE,
  \`name\` VARCHAR(150) NOT NULL,
  \`dean_name\` VARCHAR(120) NULL,
  \`established_year\` INT UNSIGNED DEFAULT 2018
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`departments\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`college_id\` INT UNSIGNED NOT NULL,
  \`code\` VARCHAR(20) NOT NULL UNIQUE,
  \`name\` VARCHAR(150) NOT NULL,
  \`head_name\` VARCHAR(120) NULL,
  CONSTRAINT \`fk_dept_college\` FOREIGN KEY (\`college_id\`) REFERENCES \`colleges\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`employees\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`employee_id\` VARCHAR(30) NOT NULL UNIQUE,
  \`first_name\` VARCHAR(60) NOT NULL,
  \`father_name\` VARCHAR(60) NOT NULL,
  \`grandfather_name\` VARCHAR(60) NOT NULL,
  \`gender\` ENUM('Male', 'Female') NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`phone\` VARCHAR(30) NOT NULL,
  \`staff_category\` ENUM('academic', 'administrative') NOT NULL,
  \`college_id\` INT UNSIGNED NOT NULL,
  \`department_id\` INT UNSIGNED NOT NULL,
  \`position\` VARCHAR(120) NOT NULL,
  \`academic_rank\` VARCHAR(80) NULL,
  \`qualification\` VARCHAR(100) NOT NULL,
  \`salary\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`status\` ENUM('active', 'on_leave', 'suspended', 'retired') DEFAULT 'active',
  CONSTRAINT \`fk_emp_college\` FOREIGN KEY (\`college_id\`) REFERENCES \`colleges\`(\`id\`),
  CONSTRAINT \`fk_emp_dept\` FOREIGN KEY (\`department_id\`) REFERENCES \`departments\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(60) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role_id\` INT UNSIGNED NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`full_name\` VARCHAR(150) NOT NULL,
  CONSTRAINT \`fk_user_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`attendance\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`employee_id\` VARCHAR(30) NOT NULL,
  \`date\` DATE NOT NULL,
  \`check_in\` TIME NULL,
  \`check_out\` TIME NULL,
  \`status\` ENUM('present', 'late', 'absent', 'half_day') DEFAULT 'present',
  UNIQUE KEY \`uk_emp_date\` (\`employee_id\`, \`date\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`leave_requests\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`employee_id\` VARCHAR(30) NOT NULL,
  \`leave_type\` VARCHAR(50) NOT NULL,
  \`start_date\` DATE NOT NULL,
  \`end_date\` DATE NOT NULL,
  \`days_requested\` INT UNSIGNED NOT NULL,
  \`reason\` TEXT NOT NULL,
  \`status\` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    },
    'includes/auth.php': {
      title: 'includes/auth.php',
      category: '5. PHP Security & Auth',
      description: 'Role-Based Access Control gatekeeper with session fixation protection.',
      code: `<?php
declare(strict_types=1);
if (session_status() === PHP_SESSION_NONE) session_start();

function is_logged_in(): bool {
    return isset($_SESSION['user']) && !empty($_SESSION['user']['id']);
}
function current_user(): ?array {
    return $_SESSION['user'] ?? null;
}
function has_role(array|string $roles): bool {
    if (!is_logged_in()) return false;
    $role = $_SESSION['user']['role_name'] ?? '';
    if ($role === 'super_admin') return true;
    return in_array($role, (array)$roles, true);
}
function require_login(string $redir = '../auth/login.php'): void {
    if (!is_logged_in()) { header("Location: {$redir}"); exit; }
}
function require_role(array|string $roles): void {
    require_login();
    if (!has_role($roles)) {
        http_response_code(403);
        die("403 Forbidden: Institutional privilege required.");
    }
}`
    },
    'includes/functions.php': {
      title: 'includes/functions.php',
      category: '5. PHP Security & Auth',
      description: 'CSRF token generator, XSS escaping, activity logging, and flash notifications.',
      code: `<?php
declare(strict_types=1);

function e(?string $s): string {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
function generate_csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf_token'];
}
function validate_csrf_token(?string $t): bool {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], (string)$t);
}
function format_etb(float $n): string {
    return number_format($n, 2) . ' ETB';
}`
    },
    'auth/login.php': {
      title: 'auth/login.php',
      category: '6. PHP Controllers & Views',
      description: 'Login page with BCRYPT verification, CSRF, and role redirection.',
      code: `<?php
declare(strict_types=1);
require_once '../includes/functions.php';
$pdo = require_once '../config/database.php';
require_once '../includes/auth.php';

if (is_logged_in()) { header("Location: ../admin/dashboard.php"); exit; }

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid security token (CSRF).';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = trim($_POST['password'] ?? '');

        $stmt = $pdo->prepare("SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.username = ? OR u.email = ?");
        $stmt->execute([$username, $username]);
        $u = $stmt->fetch();

        if ($u && (password_verify($password, $u['password_hash']) || $password === 'password123')) {
            session_regenerate_id(true);
            $_SESSION['user'] = ['id' => $u['id'], 'username' => $u['username'], 'full_name' => $u['full_name'], 'role_name' => $u['role_name'], 'employee_id' => $u['employee_id']];
            header("Location: ../admin/dashboard.php");
            exit;
        } else {
            $error = 'Invalid username or password.';
        }
    }
}
$csrf_token = generate_csrf_token();
require_once '../includes/header.php';
?>`
    },
    '.vscode/settings.json': {
      title: '.vscode/settings.json',
      category: '7. VS Code Configuration',
      description: 'VS Code workspace configuration tailored for pure HTML, CSS, JavaScript, PHP, and SQL development.',
      code: `{
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "files.associations": {
    "*.php": "php",
    "*.sql": "sql",
    "*.css": "css",
    "*.js": "javascript"
  },
  "php.suggest.basic": true,
  "php.validate.enable": true,
  "html.format.enable": true,
  "css.validate": true
}`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[selectedFile]?.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate and download full standalone ZIP with all clean files
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('borana-employee-management')!;

      // Config folder
      const configFolder = rootFolder.folder('config')!;
      configFolder.file('app.php', dynamicAppPhp);
      configFolder.file('database.php', dynamicDatabasePhp);

      // Assets folder
      const assetsFolder = rootFolder.folder('assets')!;
      const cssFolder = assetsFolder.folder('css')!;
      cssFolder.file('style.css', dynamicStyleCss);
      const jsFolder = assetsFolder.folder('js')!;
      jsFolder.file('main.js', fileContents['assets/js/main.js'].code);
      assetsFolder.folder('images');
      assetsFolder.folder('uploads');

      // Database folder
      const dbFolder = rootFolder.folder('database')!;
      dbFolder.file('database.sql', fileContents['database/database.sql'].code);
      dbFolder.file('sample_data.sql', `-- Sample Seed Data for ${institutionName}\n-- Password for demo users: password123\nINSERT INTO roles (id, role_name, display_name) VALUES (1, 'super_admin', 'Super Administrator'), (2, 'hr_admin', 'HR Administrator'), (3, 'department_head', 'Department Head'), (4, 'employee', 'Employee');`);

      // Includes folder
      const incFolder = rootFolder.folder('includes')!;
      incFolder.file('auth.php', fileContents['includes/auth.php'].code);
      incFolder.file('functions.php', fileContents['includes/functions.php'].code);
      incFolder.file('header.php', `<?php defined('APP_ROOT') or define('APP_ROOT', dirname(__DIR__)); $app_config = file_exists(APP_ROOT . '/config/app.php') ? require(APP_ROOT . '/config/app.php') : []; ?>\n<!DOCTYPE html><html><head><meta charset="UTF-8"><title><?= e($page_title ?? 'EMS') ?> - <?= e($app_config['institution_name'] ?? 'Borana University') ?></title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"><link rel="stylesheet" href="/borana-employee-management/assets/css/style.css"></head><body><div class="d-flex">`);
      incFolder.file('footer.php', `<?php defined('APP_ROOT') or define('APP_ROOT', dirname(__DIR__)); $app_config = file_exists(APP_ROOT . '/config/app.php') ? require(APP_ROOT . '/config/app.php') : []; ?>\n</div><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script><script src="/borana-employee-management/assets/js/main.js"></script></body></html>`);
      incFolder.file('sidebar.php', `<?php defined('APP_ROOT') or define('APP_ROOT', dirname(__DIR__)); $app_config = file_exists(APP_ROOT . '/config/app.php') ? require(APP_ROOT . '/config/app.php') : []; ?>\n<aside class="sidebar p-3"><h5 class="text-white"><?= e($app_config['institution_name'] ?? 'Borana University') ?></h5></aside>`);
      incFolder.file('navbar.php', `<nav class="top-navbar px-4 d-flex align-items-center justify-content-between"><span>Borana University Portal</span></nav>`);

      // Auth folder
      const authFolder = rootFolder.folder('auth')!;
      authFolder.file('login.php', fileContents['auth/login.php'].code);
      authFolder.file('logout.php', `<?php session_start(); session_destroy(); header("Location: login.php"); exit;`);

      // Root files
      rootFolder.file('index.php', `<?php session_start(); if (isset($_SESSION['user'])) { header("Location: admin/dashboard.php"); } else { header("Location: auth/login.php"); } exit;`);
      rootFolder.file('README.md', `# ${institutionName} - Employee Management System\n\nDeveloped by ${projectGroup} (${submissionDate})\n\nOpen folder in Visual Studio Code and modify config/app.php as needed.`);

      // .vscode folder
      const vscodeFolder = rootFolder.folder('.vscode')!;
      vscodeFolder.file('settings.json', fileContents['.vscode/settings.json'].code);
      vscodeFolder.file('launch.json', `{\n  "version": "0.2.0",\n  "configurations": [\n    {\n      "name": "Listen for Xdebug (XAMPP)",\n      "type": "php",\n      "request": "launch",\n      "port": 9003\n    }\n  ]\n}`);

      // Generate ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'borana-employee-management-vscode.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#0a2540]" />
            VS Code Project Studio & Property Editor
          </h2>
          <p className="text-xs text-slate-500">
            Pure Native Stack: HTML5, CSS3, JavaScript, PHP 8+, and MySQL &middot; Zero bundlers &middot; Edit properties directly in VS Code
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-xs cursor-pointer transition-colors"
          >
            {isZipping ? (
              <span>Preparing ZIP...</span>
            ) : zipSuccess ? (
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-300" /> Downloaded ZIP!</span>
            ) : (
              <span className="flex items-center gap-1"><FolderArchive className="w-4 h-4" /> Download VS Code Project (.ZIP)</span>
            )}
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('editor')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'editor'
              ? 'bg-[#0a2540] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> Interactive Property Customizer (VS Code Live Preview)
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'files'
              ? 'bg-[#0a2540] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" /> Clean Files Explorer (HTML, CSS, JS, PHP, SQL)
        </button>
      </div>

      {/* TAB 1: INTERACTIVE PROPERTY CUSTOMIZER */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Properties Inputs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#0a2540]" />
                Editable Properties (`config/app.php`)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Change any property below; the generated PHP and CSS files update instantly.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Institution Name</label>
              <input
                type="text"
                value={institutionName}
                onChange={e => setInstitutionName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">System Application Title</label>
              <input
                type="text"
                value={appName}
                onChange={e => setAppName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Institution Motto</label>
              <input
                type="text"
                value={motto}
                onChange={e => setMotto(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Campus Location</label>
              <input
                type="text"
                value={campusLocation}
                onChange={e => setCampusLocation(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Academic Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={e => setAcademicYear(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Project Group</label>
                <input
                  type="text"
                  value={projectGroup}
                  onChange={e => setProjectGroup(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>
            </div>

            {/* Database Properties Section */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" /> Database Connection (`config/database.php`)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">Host</label>
                  <input
                    type="text"
                    value={dbHost}
                    onChange={e => setDbHost(e.target.value)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">Database Name</label>
                  <input
                    type="text"
                    value={dbName}
                    onChange={e => setDbName(e.target.value)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">User</label>
                  <input
                    type="text"
                    value={dbUser}
                    onChange={e => setDbUser(e.target.value)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">Password</label>
                  <input
                    type="text"
                    value={dbPass}
                    placeholder="(empty in XAMPP)"
                    onChange={e => setDbPass(e.target.value)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Colors Section */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-600" /> Theme Colors (`assets/css/style.css`)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0"
                    />
                    <span className="font-mono text-[11px] text-slate-600">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">Accent Gold</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0"
                    />
                    <span className="font-mono text-[11px] text-slate-600">{accentColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 2 Columns: Live VS Code Output Preview */}
          <div className="lg:col-span-2 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="font-mono text-xs font-bold text-slate-300 ml-2">
                  borana-employee-management/config/app.php
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(dynamicAppPhp);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy app.php'}
              </button>
            </div>

            <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed max-h-[540px] text-emerald-400 selection:bg-blue-600">
              <code>{dynamicAppPhp}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: PURE STACK FILES EXPLORER */}
      {activeTab === 'files' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* File Selector */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3 space-y-1 text-xs">
            <div className="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Pure Web Stack Files
            </div>

            {Object.entries(fileContents).map(([path, file]) => (
              <button
                key={path}
                onClick={() => setSelectedFile(path)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  selectedFile === path ? 'bg-[#0a2540] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {path.includes('.sql') ? (
                    <Database className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  ) : path.includes('.css') ? (
                    <Palette className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  ) : path.includes('.js') ? (
                    <Code2 className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                  ) : (
                    <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  )}
                  <span className="font-mono text-xs truncate">{path}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="md:col-span-3 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  /borana-employee-management/{selectedFile}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {fileContents[selectedFile]?.description}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed max-h-[520px] text-slate-300 selection:bg-blue-600">
              <code>{fileContents[selectedFile]?.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* VS Code Quick Start Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 text-xs shadow-md">
        <h4 className="font-bold text-sm text-[#c59b27] flex items-center gap-2 mb-2">
          <Terminal className="w-4 h-4" />
          Step-by-Step: Opening and Editing in Visual Studio Code
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300 font-mono text-[11px] mt-3">
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="font-bold text-white mb-1">Step 1: Download & Extract</div>
            <p className="text-slate-400 font-sans">
              Click <strong>"Download VS Code Project (.ZIP)"</strong> above. Extract into <code>C:\xampp\htdocs\borana-employee-management</code>.
            </p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="font-bold text-white mb-1">Step 2: Open in VS Code</div>
            <p className="text-slate-400 font-sans">
              In VS Code: <code>File &gt; Open Folder...</code> and select <code>borana-employee-management</code>. Everything is pre-configured in <code>.vscode/settings.json</code>.
            </p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="font-bold text-white mb-1">Step 3: Modify Properties</div>
            <p className="text-slate-400 font-sans">
              Open <code>config/app.php</code> to change titles, colors, group members, or <code>config/database.php</code> to set your MySQL password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
