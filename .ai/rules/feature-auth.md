---
paths:
  - 'app/Http/Responses/**, app/Providers/FortifyServiceProvider.php, tests/Feature/Auth/AuthenticationTest.php'
---

# Feature Auth

## Redirect users to their role-specific request list after authentication
Bind Fortify's LoginResponse and TwoFactorLoginResponse contracts to role-aware responses. Employees go to leave-requests.index; administrators go to admin.leave-requests.index. Preserve Fortify's JSON responses for XHR/API clients.

## Logout returns users to login
Fortify's LogoutResponse contract is bound to RedirectToLoginLogoutResponse so browser logouts redirect to the named login route. Preserve Fortify's 204 JSON response for JSON clients.
