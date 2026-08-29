---
paths:
  - 'app/Models/LeaveType.php, app/Http/Requests/*LeaveTypeRequest.php, resources/js/pages/admin/leave-types/**, database/migrations/*leave_types*.php'
---

# Migrations

## Configure optional leave-type day limits
Each leave type has an optional positive day_limit. Administrators configure it in the create/edit dialog, and the Leave types list shows the limit or No limit. Limits are applied only while the administrator has enabled leave-limit enforcement in General settings.
