---
paths:
  - 'resources/js/pages/admin/settings/**, app/Http/Controllers/AdminSettingsController.php, routes/web.php, resources/js/components/admin-sidebar.tsx'
---

# Controllers Js Components

## Keep administration settings within the admin layout
Administration settings are served from the protected admin.settings.general route and resolve through the persistent AdminLayout/sidebar. Counted weekdays and minimum request notice are persisted and immediately affect leave-request behavior; per-type day limits are managed on the Leave types page and can be enforced through the General settings switch.
