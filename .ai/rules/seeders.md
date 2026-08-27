---
paths:
  - database/seeders/DatabaseSeeder.php
---

# Seeders

## Keep evaluation accounts idempotent
DatabaseSeeder maintains seeded employee and administrator evaluation accounts with known local credentials. Use email-based firstOrNew records so repeated seeding updates the accounts without creating duplicates.
