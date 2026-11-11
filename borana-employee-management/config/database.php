<?php
/**
 * =====================================================================
 * BORANA UNIVERSITY - EMPLOYEE MANAGEMENT SYSTEM
 * DATABASE CONNECTION CONFIGURATION (VS CODE & XAMPP)
 * =====================================================================
 * 
 * Edit these database settings in VS Code according to your MySQL setup.
 * Default XAMPP settings: Host='localhost', Port='3306', User='root', Pass=''
 */

declare(strict_types=1);

// Database connection parameters (modify in VS Code as needed)
$db_host = 'localhost';
$db_port = '3306';
$db_name = 'borana_employee_management';
$db_user = 'root';
$db_pass = ''; // Default XAMPP password is empty

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
    error_log("Database Connection Error: " . $e->getMessage());
    die("<div style='font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;padding:30px;background:#fef2f2;border:1px solid #f87171;color:#991b1b;max-width:650px;margin:50px auto;border-radius:10px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);'>
        <h3 style='margin-top:0;color:#7f1d1d;'>Database Connection Failed - Borana University EMS</h3>
        <p>Could not connect to MySQL database <strong>{$db_name}</strong> on <code>{$db_host}:{$db_port}</code>.</p>
        <p><strong>Steps to resolve in XAMPP & VS Code:</strong></p>
        <ol style='line-height:1.6;'>
          <li>Open <strong>XAMPP Control Panel</strong> and ensure <strong>Apache</strong> and <strong>MySQL</strong> are started.</li>
          <li>Open <a href='http://localhost/phpmyadmin' target='_blank'>http://localhost/phpmyadmin</a></li>
          <li>Create database: <code>{$db_name}</code></li>
          <li>Import <code>database/database.sql</code> then <code>database/sample_data.sql</code></li>
          <li>If you have set a MySQL root password, edit <code>config/database.php</code> in VS Code and set <code>\$db_pass</code>.</li>
        </ol>
        <p style='margin-bottom:0;'><small style='color:#b91c1c;'>Error details: " . htmlspecialchars($e->getMessage()) . "</small></p>
    </div>");
}

return $pdo;
