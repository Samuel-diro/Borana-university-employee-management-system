/**
 * =====================================================================
 * BORANA UNIVERSITY - EMPLOYEE MANAGEMENT SYSTEM
 * MASTER JAVASCRIPT (VANILLA ES6)
 * =====================================================================
 * Group 3 - November 2026
 * Pure JavaScript - Works natively in browser without npm or build step.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Borana University EMS Initialized (Group 3)');

    // 1. Auto-dismiss Bootstrap flash alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert-dismissible');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
            if (bsAlert) bsAlert.close();
        }, 5000);
    });

    // 2. Real-time Table Search Filter (Client-side fast search)
    const tableSearchInput = document.getElementById('tableSearchInput');
    if (tableSearchInput) {
        tableSearchInput.addEventListener('keyup', function () {
            const query = this.value.toLowerCase().trim();
            const tableRows = document.querySelectorAll('.table tbody tr');

            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // 3. Conditional Fields Toggle for Staff Category (Academic vs Administrative)
    const staffCategorySelect = document.getElementById('staff_category');
    const academicRankWrapper = document.getElementById('academic_rank_wrapper');
    if (staffCategorySelect && academicRankWrapper) {
        const updateRankVisibility = () => {
            if (staffCategorySelect.value === 'administrative') {
                academicRankWrapper.style.display = 'none';
            } else {
                academicRankWrapper.style.display = 'block';
            }
        };
        staffCategorySelect.addEventListener('change', updateRankVisibility);
        updateRankVisibility();
    }

    // 4. Leave Dates Day Calculation
    const startDateInput = document.getElementById('leave_start_date');
    const endDateInput = document.getElementById('leave_end_date');
    const daysRequestedInput = document.getElementById('days_requested');

    if (startDateInput && endDateInput && daysRequestedInput) {
        const calculateDays = () => {
            const start = new Date(startDateInput.value);
            const end = new Date(endDateInput.value);

            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                daysRequestedInput.value = diffDays;
            }
        };

        startDateInput.addEventListener('change', calculateDays);
        endDateInput.addEventListener('change', calculateDays);
    }
});

/**
 * Trigger browser print for reports
 */
function triggerReportPrint() {
    window.print();
}

/**
 * Confirm deletion action with descriptive name
 */
function confirmAction(message) {
    return confirm(message || 'Are you sure you want to proceed with this operation?');
}
