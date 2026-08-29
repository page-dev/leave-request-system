---
paths:
  - 'app/Models/LeaveSetting.php, app/Models/LeaveType.php, app/Http/Requests/*LeaveRequestRequest.php, app/Concerns/ValidatesLeaveRequestLimit.php, resources/js/pages/admin/settings/**'
---

# Settings

## Toggle enforcement of per-type leave limits
The enforce_leave_limits setting defaults off. When enabled, employee requests cannot take pending and approved leave days for a type above that type's optional day_limit; leave days use the configured counted weekdays and updates exclude the request being edited. Types without a day limit remain unrestricted.
