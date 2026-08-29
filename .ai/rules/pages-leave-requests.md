---
paths:
  - 'app/Http/Controllers/LeaveRequestController.php, resources/js/pages/leave-requests/**'
---

# Pages Leave Requests

## Show per-type usage when leave limits are active
The employee leave-request page exposes used_days for each limited leave type only while enforce_leave_limits is active. It sums the employee's pending and approved requests using configured counted weekdays; the new-request selector displays used/limit next to those types.
