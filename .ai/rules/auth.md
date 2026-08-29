---
paths:
  - 'resources/js/components/leave-request-top-nav.tsx, resources/js/components/user-menu-content.tsx, resources/js/pages/auth/verify-email.tsx'
---

# Auth

## Submit logout through the generated POST route
Logout controls use the Wayfinder `logout()` route with Inertia's POST method. This keeps logout CSRF-protected and works from employee, admin, and verification screens.
