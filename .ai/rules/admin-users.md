---
paths:
  - 'app/Models/User.php, app/Http/Requests/*UserRequest.php, app/Actions/Fortify/CreateNewUser.php, resources/js/pages/admin/users/**'
---

# Admin Users

## Store user names as first and last names
User creation and updates require first_name and last_name. The User model synchronizes the legacy name column as their squished full-name value so existing authentication and leave-request displays remain compatible.
