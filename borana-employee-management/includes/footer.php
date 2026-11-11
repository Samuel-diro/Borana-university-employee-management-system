<?php
/**
 * Global Footer Component (Bootstrap 5 & Vanilla JS)
 * Borana University Employee Management System
 */
defined('APP_ROOT') or define('APP_ROOT', dirname(__DIR__));
$app_config = file_exists(APP_ROOT . '/config/app.php') ? require(APP_ROOT . '/config/app.php') : [];
?>
        <!-- End of Content Container -->
        <footer class="mt-auto py-3 bg-white border-top text-center text-muted no-print" style="font-size: 0.8rem;">
            <div class="container-fluid px-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
                <span>&copy; <?= date('Y') ?> <strong><?= e($app_config['institution_name'] ?? 'Borana University') ?></strong> &middot; All Rights Reserved</span>
                <span class="text-secondary"><?= e($app_config['app_name'] ?? 'Employee Management System') ?> &middot; <strong><?= e($app_config['project_group'] ?? 'Group 3') ?> (<?= e($app_config['project_submission'] ?? 'Nov 2026') ?>)</strong></span>
            </div>
        </footer>
    </div> <!-- Close main content wrapper -->
</div> <!-- Close flex container -->

<!-- Bootstrap 5 Bundle JS with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<!-- Master Custom JS (Editable in VS Code at assets/js/main.js) -->
<script src="/borana-employee-management/assets/js/main.js"></script>
</body>
</html>
