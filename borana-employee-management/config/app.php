<?php
/**
 * =====================================================================
 * BORANA UNIVERSITY - EMPLOYEE MANAGEMENT SYSTEM
 * SYSTEM CONFIGURATION PROPERTIES (VS CODE EDITABLE)
 * =====================================================================
 * 
 * Edit this file in Visual Studio Code to modify institution branding,
 * group members, system titles, colors, currency, and file upload limits.
 */

declare(strict_types=1);

return [
    // -----------------------------------------------------------------
    // 1. INSTITUTION & SYSTEM IDENTITY (Edit as needed in VS Code)
    // -----------------------------------------------------------------
    'app_name'             => 'Borana University Employee Management System',
    'app_short_name'       => 'BU-EMS',
    'app_version'          => '1.0.0',
    'institution_name'     => 'Borana University',
    'institution_motto'    => 'Knowledge Through Wisdom & Innovation',
    'campus_location'      => 'Yabello, Borana Zone, Oromia, Ethiopia',
    'postal_address'       => 'P.O. Box 77, Yabello, Ethiopia',
    'official_email'       => 'info@borana.edu.et',
    'official_phone'       => '+251 46 443 0100',
    'official_website'     => 'https://www.borana.edu.et',
    'academic_year'        => '2026 / 2027',
    
    // -----------------------------------------------------------------
    // 2. PROJECT GROUP METADATA (Group 3 Information)
    // -----------------------------------------------------------------
    'project_group'        => 'Group 3',
    'project_submission'   => 'November 2026',
    'group_members'        => [
        ['no' => 1, 'name' => 'Samuel Diro',       'id' => '446', 'role' => 'Project Lead & Full-Stack Developer'],
        ['no' => 2, 'name' => 'Yohanis Hailu',      'id' => '231', 'role' => 'Database Architect & Backend Engineer'],
        ['no' => 3, 'name' => 'Wayneshet Mekuria',  'id' => '222', 'role' => 'HR Domain Analyst & Security Engineer'],
        ['no' => 4, 'name' => 'Tsegaye Tadesse',    'id' => '330', 'role' => 'UI/UX Designer & Frontend Developer'],
    ],

    // -----------------------------------------------------------------
    // 3. UI/UX THEME & COLOR PROPERTIES (Inspired by University Seal)
    // -----------------------------------------------------------------
    'theme' => [
        'primary_color'    => '#0a2540', // Institutional Royal Navy
        'primary_dark'     => '#07192c',
        'primary_light'    => '#163e66',
        'accent_gold'      => '#c59b27', // University Gold
        'accent_light'     => '#dfb238',
        'bg_canvas'        => '#f8fafc',
    ],

    // -----------------------------------------------------------------
    // 4. FINANCIAL & LOCALIZATION SETTINGS
    // -----------------------------------------------------------------
    'currency'             => 'ETB',
    'currency_symbol'      => 'ETB',
    'date_format'          => 'Y-m-d',
    'display_date_format'  => 'd M Y',
    'timezone'             => 'Africa/Addis_Ababa',

    // -----------------------------------------------------------------
    // 5. EMPLOYEE ID PREFIX & FORMAT
    // -----------------------------------------------------------------
    'emp_id_prefix'        => 'BU-EMP-',
    'emp_id_padding'       => 3, // BU-EMP-001

    // -----------------------------------------------------------------
    // 6. SECURITY & UPLOAD CONSTRAINTS
    // -----------------------------------------------------------------
    'session_lifetime'     => 7200, // 2 Hours in seconds
    'upload_max_size_mb'   => 5,    // Max image upload in Megabytes
    'allowed_image_types'  => ['image/jpeg', 'image/png', 'image/webp'],
];
