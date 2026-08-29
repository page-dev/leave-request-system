---
paths:
  - 'app/Http/Responses/**, app/Providers/FortifyServiceProvider.php, tests/Feature/Auth/AuthenticationTest.php'
---

# Feature Auth

## Redirect users to their role-specific request list after authentication
Bind Fortify's LoginResponse and TwoFactorLoginResponse contracts to role-aware responses. Employees go to leave-requests.index; administrators go to admin.leave-requests.index. Preserve Fortify's JSON responses for XHR/API clients.
