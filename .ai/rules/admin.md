---
paths:
  - 'resources/js/pages/admin/**'
---

# Admin

## Modal leave-type creation and feedback
Create leave types from the `NewLeaveTypeDialog` on the management list rather than a dedicated creation page. Submit with the generated `store` action and close/reset only after success; success/error notifications come from the global `useFlashToast` listener and the controller's Inertia flashes.

## Modal leave-type editing
Edit leave types from `EditLeaveTypeDialog` on the management list, prefilled from the selected row. Submit through the generated `update` action and close/reset only after success so the existing global flash toast reports the result.
