---
paths:
  - 'app/Http/Controllers/UserController.php, resources/js/pages/admin/users/**'
---

# Users

## Use protected activation toggles
User status is controlled through an accessible switch in the Status column, not action buttons. The switch may reactivate inactive users; it may deactivate only non-current accounts when at least one active administrator remains, with the backend enforcing those rules.
