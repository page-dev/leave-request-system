---
paths:
  - routes/web.php
---

# Routes

## Protect leave-management routes with verified authentication
Employee leave-request and administrative routes are grouped behind `auth` and `verified`. Role, ownership, pending-state, and review authorization remain enforced by the controller policies.
