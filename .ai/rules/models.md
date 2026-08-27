---
paths:
  - app/Models/LeaveRequest.php
  - app/Models/User.php
---

# Models

## Protect server-managed leave request fields
Only leave type, date range, and reason are mass assignable. Controllers must derive ownership from the authenticated user and set status and review metadata only after authorization.

## Use the administrator role for approvers
The `administrator` role identifies users who can manage leave types and review leave requests. New accounts retain the migration default of `employee`.

## Expose inclusive leave duration
Leave request serialization appends a server-derived `days` attribute. It is the inclusive calendar-day count from start_date through end_date and is the value displayed in leave-request tables.
