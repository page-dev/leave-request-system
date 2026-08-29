---
paths:
  - 'app/Http/Controllers/**'
---

# Controllers

## Admin request search
The admin leave-request index accepts a `search` query parameter and matches the related employee's name or email case-insensitively. Preserve this value in Inertia's `filters` prop so it composes with the status and leave-type filters.

## Admin request date-range filtering
The admin leave-request index accepts `start_date` and `end_date` query parameters. When both are present, match requests inclusively with `start_date <= end_date` and `end_date >= start_date` so partial and boundary overlaps remain visible; preserve both values in the Inertia `filters` prop.
