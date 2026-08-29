---
paths:
  - 'app/Http/Controllers/UserController.php, app/Models/User.php, app/Providers/FortifyServiceProvider.php, app/Policies/UserPolicy.php, app/Http/Requests/*UserRequest.php'
---

# Http Requests

## Protect active administrator access
Users use an `is_active` flag rather than deletion. Inactive users cannot authenticate; administrators cannot deactivate themselves or leave the system without an active administrator. Role changes away from administrator enforce the same minimum-admin safeguard.
