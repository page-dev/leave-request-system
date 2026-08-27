---
paths:
  - 'app/Http/Requests/*LeaveRequestRequest.php'
---

# Requests

## Reject overlapping pending and approved leave requests
Creating or updating a leave request must reject an inclusive date-range overlap with another Pending or Approved request owned by the same employee. The request being updated is excluded; Rejected requests do not block a new range. Attach the error to `end_date` for the shared date-range error card.
