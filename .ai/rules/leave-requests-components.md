---
paths:
  - 'resources/js/pages/admin/settings/**, app/Http/Controllers/AdminSettingsController.php, app/Models/LeaveSetting.php, app/Http/Requests/UpdateLeaveSettingsRequest.php, app/Http/Requests/*LeaveRequestRequest.php, app/Concerns/ValidatesLeaveRequestNotice.php, resources/js/pages/leave-requests/components/new-request-dialog.tsx'
---

# Leave Requests Components

## Persist and enforce minimum request notice
Minimum notice is a non-negative calendar-day setting saved alongside counted weekdays. Creating or updating a leave request before that threshold must attach a start_date error; the employee request dialog renders start/end date errors in its shared date-range card. Leave-type day limits are enforced only when the administrator enables them in General settings.
