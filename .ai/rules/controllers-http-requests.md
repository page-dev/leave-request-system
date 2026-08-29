---
paths:
  - 'resources/js/pages/admin/settings/**, app/Http/Controllers/AdminSettingsController.php, app/Models/LeaveSetting.php, app/Models/LeaveRequest.php, app/Http/Controllers/LeaveRequestController.php, app/Http/Requests/UpdateLeaveSettingsRequest.php'
---

# Controllers Http Requests

## Apply saved counted weekdays to all leave-day totals
Administrators save one or more ISO weekdays (Monday=1 through Sunday=7) through the General settings page. Employee and admin leave-request responses load those settings once into request context; the LeaveRequest days attribute and employee form preview count only selected weekdays. Minimum request notice is persisted and enforced when an employee creates or updates a request. Per-type day limits are managed from Leave types and are enforced only when the General settings switch is enabled.
