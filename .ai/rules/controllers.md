---
paths:
  - 'app/Http/Controllers/**'
---

# Controllers

## Admin request search
The admin leave-request index accepts a `search` query parameter and matches the related employee's name or email case-insensitively. Preserve this value in Inertia's `filters` prop so it composes with the status and leave-type filters.
