-- =====================================================================
-- Web-Based Employee Management System for Borana University
-- Project Group: Group 3 | Date: November 2026
-- Group Members:
--   1. Samuel Diro (ID: 446)
--   2. Yohanis Hailu (ID: 231)
--   3. Wayneshet Mekuria (ID: 222)
--   4. Tsegaye Tadesse (ID: 330)
-- Target Database: MySQL 8+ / MariaDB (XAMPP phpMyAdmin)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `borana_employee_management`
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `borana_employee_management`;

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `role_name` VARCHAR(50) NOT NULL UNIQUE,
  `display_name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. COLLEGES TABLE
CREATE TABLE IF NOT EXISTS `colleges` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `dean_name` VARCHAR(120) NULL,
  `description` TEXT NULL,
  `established_year` INT UNSIGNED DEFAULT 2018,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS `departments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `college_id` INT UNSIGNED NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `head_name` VARCHAR(120) NULL,
  `office_location` VARCHAR(100) NULL,
  `email` VARCHAR(100) NULL,
  `phone` VARCHAR(30) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_dept_college` FOREIGN KEY (`college_id`) 
    REFERENCES `colleges`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. POSITIONS TABLE
CREATE TABLE IF NOT EXISTS `positions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL UNIQUE,
  `staff_category` ENUM('academic', 'administrative') NOT NULL DEFAULT 'administrative',
  `min_salary` DECIMAL(10,2) DEFAULT 0.00,
  `max_salary` DECIMAL(10,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. EMPLOYEES TABLE
CREATE TABLE IF NOT EXISTS `employees` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` VARCHAR(30) NOT NULL UNIQUE,
  `first_name` VARCHAR(60) NOT NULL,
  `father_name` VARCHAR(60) NOT NULL,
  `grandfather_name` VARCHAR(60) NOT NULL,
  `gender` ENUM('Male', 'Female') NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `national_id` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL,
  `emergency_contact` VARCHAR(100) NULL,
  `address` VARCHAR(255) NULL,
  `city` VARCHAR(80) DEFAULT 'Yabello',
  
  -- Academic / Admin Classification
  `staff_category` ENUM('academic', 'administrative') NOT NULL,
  `college_id` INT UNSIGNED NOT NULL,
  `department_id` INT UNSIGNED NOT NULL,
  `position` VARCHAR(120) NOT NULL,
  `academic_rank` VARCHAR(80) NULL COMMENT 'Professor, Associate Prof, Assistant Prof, Lecturer, Graduate Assistant',
  `qualification` VARCHAR(100) NOT NULL,
  `specialization` VARCHAR(150) NULL,
  `employment_type` ENUM('Full-Time', 'Contract', 'Part-Time') DEFAULT 'Full-Time',
  `hire_date` DATE NOT NULL,
  `salary` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('active', 'on_leave', 'suspended', 'retired', 'terminated') DEFAULT 'active',
  `photo_path` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `idx_emp_id` (`employee_id`),
  INDEX `idx_staff_cat` (`staff_category`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_emp_college` FOREIGN KEY (`college_id`) 
    REFERENCES `colleges`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_emp_dept` FOREIGN KEY (`department_id`) 
    REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. USERS TABLE (Authentication & RBAC)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` VARCHAR(30) NULL UNIQUE,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role_id` INT UNSIGNED NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) 
    REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_user_employee` FOREIGN KEY (`employee_id`) 
    REFERENCES `employees`(`employee_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` VARCHAR(30) NOT NULL,
  `date` DATE NOT NULL,
  `check_in` TIME NULL,
  `check_out` TIME NULL,
  `status` ENUM('present', 'late', 'absent', 'half_day') NOT NULL DEFAULT 'present',
  `remarks` VARCHAR(255) NULL,
  `recorded_by` VARCHAR(60) DEFAULT 'Biometric/System',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_emp_date` (`employee_id`, `date`),
  INDEX `idx_att_date` (`date`),
  INDEX `idx_att_status` (`status`),
  CONSTRAINT `fk_att_employee` FOREIGN KEY (`employee_id`) 
    REFERENCES `employees`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. LEAVE TYPES TABLE
CREATE TABLE IF NOT EXISTS `leave_types` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(60) NOT NULL UNIQUE,
  `default_days_per_year` INT UNSIGNED NOT NULL DEFAULT 30,
  `is_paid` TINYINT(1) DEFAULT 1,
  `description` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. LEAVE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS `leave_requests` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` VARCHAR(30) NOT NULL,
  `leave_type_id` INT UNSIGNED NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `days_requested` INT UNSIGNED NOT NULL,
  `reason` TEXT NOT NULL,
  `attachment_path` VARCHAR(255) NULL,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `reviewed_by` INT UNSIGNED NULL COMMENT 'User ID of reviewer',
  `review_remarks` TEXT NULL,
  `reviewed_at` DATETIME NULL,
  INDEX `idx_leave_status` (`status`),
  INDEX `idx_leave_emp` (`employee_id`),
  CONSTRAINT `fk_leave_employee` FOREIGN KEY (`employee_id`) 
    REFERENCES `employees`(`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_leave_type` FOREIGN KEY (`leave_type_id`) 
    REFERENCES `leave_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_leave_reviewer` FOREIGN KEY (`reviewed_by`) 
    REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. ACTIVITY LOGS TABLE (Audit Trail)
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NULL,
  `username` VARCHAR(60) NOT NULL,
  `user_role` VARCHAR(50) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_log_user` (`user_id`),
  INDEX `idx_log_date` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
