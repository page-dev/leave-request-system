---
paths:
  - routes/web.php
---

# Routes

## Protect leave-management routes with verified authentication
Employee leave-request and administrative routes are grouped behind `auth` and `verified`. Role, ownership, pending-state, and review authorization remain enforced by the controller policies.

## Legacy leave-type creation URL
Keep a protected GET redirect from `/admin/leave-types/create` to `admin.leave-types.index`. Creation happens in the list modal, but this explicit route prevents the resource update/delete parameter route from turning stale bookmarks into a 405 response.
