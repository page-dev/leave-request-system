---
paths:
  - 'app/Http/Controllers/LeaveRequestController.php, resources/js/pages/leave-requests/**, tests/Feature/LeaveRequestIndexTest.php'
---

# Feature

## Keep employee leave-request filters server-backed and overlap-aware
The employee list accepts status, leave_type_id, start_date, and end_date query parameters and preserves them in Inertia filters. When both dates are present, return any owned request with an inclusive overlap (start_date <= end_date and end_date >= start_date); date boundaries count as matches.
