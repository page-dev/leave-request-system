# Leave Request System

A role-based employee leave management application built as a Laravel practical assessment. Employees can submit and track leave requests, while administrators can review decisions, manage leave types and users, configure leave policies, and view an audit trail.

## Highlights

- Secure email-and-password authentication with email verification, password reset, two-factor authentication, and passkey support.
- Separate employee and administrator roles enforced with Laravel policies.
- Employee leave-request workflow: create, filter, view, update, and delete pending requests.
- Administrator review workflow: search and filter requests, approve or reject pending requests, and record a review note and reviewer metadata.
- Configurable leave rules, including counted weekdays, minimum notice, and optional leave-type limits.
- Validation that prevents invalid date ranges and conflicting pending or approved leave periods.
- Administrator management of leave types and users, with safeguards that keep at least one active administrator available.
- Audit history for administrative changes and leave-request decisions.
- Responsive React interface with Inertia, TypeScript, Tailwind CSS, and shadcn/ui components.

## Tech Stack

- PHP 8.4 and Laravel 13
- React 19, TypeScript, and Inertia.js 3
- Tailwind CSS 4 and shadcn/ui
- Supabase (PostgreSQL) for application data
- Pest for automated testing
- Vite for frontend tooling

## Roles and Permissions

| Role | Capabilities |
| --- | --- |
| Employee | Creates and manages only their own pending leave requests; views their request history and statuses. |
| Administrator | Reviews pending requests, manages leave types and users, configures leave policy settings, and reviews audit logs. |

Authorization is enforced server-side. Employees cannot access administrative functions or alter another employee's requests, and reviewed requests cannot be edited, deleted, or reviewed again.

## Local Setup

### Requirements

- PHP 8.4 or newer with the extensions required by Laravel
- Composer 2
- Node.js 20 or newer and npm

### Installation

```bash
git clone <your-repository-url>
cd leave-request-system
composer install
npm install
```

Create the local environment file and application key:

```bash
cp .env.example .env
php artisan key:generate
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
php artisan key:generate
```

Configure the PostgreSQL credentials from your Supabase project in `.env`. At minimum, set `DB_CONNECTION=pgsql` along with the host, port, database, username, password, and SSL mode supplied by Supabase. Keep these values private and never commit them.

Then migrate and seed the database:

```bash
php artisan migrate --seed
```

Build frontend assets and start the development environment:

```bash
npm run build
composer run dev
```

Then visit the URL shown by Laravel, normally `http://localhost:8000`.

## Local Demo Accounts

Running the database seeder creates these **development-only** accounts:

| Role | Email | Password |
| --- | --- | --- |
| Employee | `employee@example.com` | `password` |
| Administrator | `admin@example.com` | `password` |

These accounts are intentionally predictable for local evaluation. Change or replace them before any public deployment, and never commit real credentials or a production `.env` file.

## Testing

Run the full automated test suite:

```bash
php artisan test --compact
```

Useful quality checks are also available:

```bash
npm run lint:check
npm run format:check
npm run types:check
vendor/bin/pint --test
```

## Key Business Rules

- New leave requests begin in the `pending` state.
- Employees can change or delete only their own pending requests.
- An administrator may approve or reject a request only while it is pending; decisions are final.
- Leave requests must include a valid leave type, dates where the end date is not before the start date, and a reason.
- Pending and approved requests cannot overlap for the same employee. Rejected requests do not prevent a new request for the same dates.
- Configured notice periods and optional leave-type day limits are validated before a request is accepted.
- A leave type with existing requests cannot be deleted, preserving historical records.

## Deployment Notes

Set production environment variables through the hosting platform, including `APP_ENV=production`, `APP_DEBUG=false`, a secure `APP_KEY`, database credentials, and a production `APP_URL`. Run migrations with `php artisan migrate --force`, seed only intentional demo data, and build frontend assets with `npm run build`.

Do not expose the default demo passwords on a public production site. Use distinct, securely managed accounts for demonstrations or provide access privately.

## Project Scope

This project was created as a practical assessment focused on a dependable core workflow: authentication, authorization, validation, leave management, administrative review, and a usable responsive interface. It intentionally avoids enterprise HR features such as payroll integration, calendars, multi-level approvals, and notification systems.

## License

This repository is shared as a portfolio project. Add a license that matches how you want others to use the code before publishing it publicly.
