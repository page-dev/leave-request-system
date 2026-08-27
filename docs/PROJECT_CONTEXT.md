# Leave Request System — Project Context

## Project Purpose

This application is being developed for a **software development practical assessment**.

The goal is to build and deploy a **complete, dependable Employee Leave Request System** that satisfies the minimum required scope while applying reasonable business rules where the assessment is intentionally unclear.

Favor **correctness, authorization, validation, maintainability, and a reliable deployed system** over unnecessary features or excessive complexity.

---

## Technology Stack

Use the application's currently installed versions and existing project conventions.

Primary stack:

- Laravel
- React
- Inertia.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Laravel authentication
- Eloquent ORM
- Vite
- Laravel Boost for AI-assisted development

Before introducing a new package or implementation pattern:

1. Inspect the existing project structure and installed dependencies.
2. Prefer Laravel, Inertia, React, and shadcn conventions already present in the application.
3. Use Laravel Boost documentation/search capabilities for version-specific Laravel ecosystem guidance where appropriate.
4. Avoid adding dependencies when the requirement can reasonably be implemented with the existing stack.

---

# Assessment Requirements

The following are the **minimum required system capabilities**.

## Authentication and Roles

The system must provide login and logout functionality for two roles:

- Employee
- Administrator / Approver

## Employee Capabilities

Employees must be able to:

- Create their own leave requests.
- View their own leave requests.
- Update their own leave requests.
- Delete their own leave requests.
- Clearly see the current status and relevant details of each request.
- Search or filter requests where useful.

## Administrator / Approver Capabilities

Administrators / Approvers must be able to:

- View submitted leave requests.
- Approve submitted leave requests.
- Reject submitted leave requests.
- Create leave types.
- View leave types.
- Update leave types.
- Delete leave types.
- Search or filter requests where useful.

---

# Assessment Interpretation

The assessment explicitly allows reasonable assumptions when a requirement is unclear.

When implementing an unclear behavior:

1. Choose a reasonable and defensible solution.
2. Apply it consistently throughout the application.
3. Keep the implementation simple enough for the practical assessment.
4. Record the assumption for inclusion in the final implementation summary.

Do **not** invent unnecessary business features simply because a real-world HR system might contain them.

---

# Agreed Assumptions

Unless the assessment later explicitly states otherwise, use the following assumptions.

## Authentication Identifier

Users log in using:

- **Email address**
- **Password**

Do not add username-based authentication unless requirements change.

The evaluator will be provided working credentials for at least:

- one Employee account; and
- one Administrator / Approver account.

---

## Request Creation Ownership

Leave requests are initiated by **Employees only**.

An Administrator / Approver does **not** create a leave request on behalf of an employee under the current scope.

The employee associated with a new request must therefore come from the **authenticated user**, not from a user selector supplied by the form.

---

## Approval Decision Finality

An Administrator / Approver may review a request only while its status is **Pending**.

Once the request becomes:

- Approved; or
- Rejected

the decision is considered **final** for the scope of this assessment.

Do not add decision reversal, reopening, or revocation workflows unless the requirement changes.

---

# Leave Request Workflow

Use these statuses:

- `pending`
- `approved`
- `rejected`

Expected transition flow:

```text
Pending -> Approved
Pending -> Rejected
```

No other state transitions are currently required.

A new request must automatically receive the `pending` status.

---

# Employee Request Rules

An Employee may:

- create a request for themselves;
- view their own requests;
- edit their own request while it is Pending;
- delete their own request while it is Pending;
- view Approved or Rejected requests.

An Employee may **not**:

- access another employee's protected leave request;
- modify another employee's request;
- delete another employee's request;
- approve or reject requests;
- edit an Approved request;
- edit a Rejected request;
- delete an Approved request;
- delete a Rejected request;
- access Administrator-only management functionality.

These restrictions must be enforced on the **server side**, not merely by hiding interface controls.

Prefer Laravel authorization facilities such as policies, gates, and middleware where they fit the existing project architecture.

---

# Administrator / Approver Rules

An Administrator / Approver may:

- view submitted requests;
- inspect relevant request and employee details;
- approve a Pending request;
- reject a Pending request;
- manage leave types;
- use search and filters to locate requests.

An Administrator / Approver may not review a request again after it has already been Approved or Rejected under the current assumptions.

The backend must verify that a request is still Pending immediately before applying an approval or rejection.

---

# Leave Request Data

A leave request should contain at minimum:

- Employee / user reference
- Leave type
- Start date
- End date
- Reason
- Status
- Submission timestamps

Recommended review-related fields:

- `reviewed_by`
- `reviewed_at`
- `review_note` (optional)

The reviewer should reference the Administrator / Approver who performed the decision.

---

# Leave Request Validation

At minimum:

- Leave type is required.
- Leave type must reference a valid leave type.
- Start date is required.
- End date is required.
- End date must not be earlier than Start date.
- Reason is required.
- The employee must be derived from the authenticated Employee account.
- The client must not be trusted to assign request ownership.
- The client must not be trusted to assign the initial status.

Prefer dedicated Laravel Form Request validation classes when consistent with the application's structure.

---

# Leave Types

Administrators / Approvers must have CRUD functionality for leave types.

Recommended fields:

- `id`
- `name`
- `description`
- `is_active`
- timestamps

`is_active` is recommended so an obsolete leave type can stop being selectable for new requests without destroying historical references.

If a leave type is already referenced by leave requests, avoid breaking historical data.

A reasonable implementation is to:

- prevent destructive deletion when referenced;
- use soft deletion; or
- deactivate the leave type.

Choose one simple, consistent solution and document the decision if it goes beyond the explicit requirement.

---

## Core Domain Model

The application is expected to contain:

- User
- LeaveType
- LeaveRequest

Relationships:

- A User has many LeaveRequests.
- A LeaveRequest belongs to one Employee/User.
- A LeaveRequest belongs to one LeaveType.
- A LeaveRequest may reference the Administrator/Approver who reviewed it.
- A LeaveType has many LeaveRequests.

---

# Search and Filtering

The assessment explicitly requires appropriate search or filtering where useful.

Keep filtering practical rather than over-engineered.

## Employee Request List

Useful filters:

- status;
- leave type;
- optional text/date search if useful.

## Administrator Request List

Useful filters:

- employee;
- status;
- leave type;
- date or date range where useful.

Filtering should work on the server when practical so URLs/query parameters remain meaningful and results are dependable.

---

# User Interface Expectations

Use existing shadcn/ui components and project design conventions.

Prioritize clarity and evaluator usability.

## Status Display

Statuses must be immediately recognizable.

Recommended visual treatment:

- Pending — warning/neutral badge
- Approved — positive badge
- Rejected — destructive/negative badge

Do not rely on color alone; status text must remain visible.

---

## Action Feedback

Provide clear feedback after important actions, such as:

- request submitted;
- request updated;
- request deleted;
- request approved;
- request rejected;
- leave type created/updated/deleted;
- operation denied because the request has already been reviewed.

Use existing Laravel/Inertia flash-message conventions where possible.

---

## Confirmation

Use confirmation for destructive or consequential actions, including:

- deleting a leave request;
- deleting/deactivating a leave type;
- approving a request;
- rejecting a request.

shadcn/ui `AlertDialog` is appropriate if already available or easy to add.

---

## Empty States

Do not leave an unexplained blank table.

Examples:

- No leave requests found.
- You have not submitted a leave request yet.
- No pending requests are currently awaiting review.

---

## Responsive Behavior

The system should remain usable on smaller displays.

Tables may scroll horizontally when necessary, but forms, navigation, actions, badges, and important details must remain accessible.

---

# Suggested Pages

The final routing structure may follow existing starter-kit conventions, but the application will likely require pages equivalent to the following.

## Employee

- Dashboard
- My Leave Requests
- Create Leave Request
- View Leave Request
- Edit Pending Leave Request

Example route concepts:

```text
/dashboard
/leave-requests
/leave-requests/create
/leave-requests/{leaveRequest}
/leave-requests/{leaveRequest}/edit
```

## Administrator / Approver

- Admin Dashboard
- Leave Request Review List
- Leave Request Details
- Leave Type Management

Example route concepts:

```text
/admin/dashboard
/admin/leave-requests
/admin/leave-requests/{leaveRequest}
/admin/leave-types
```

Exact route naming should follow established Laravel conventions in the application.

---

# Dashboard Scope

Dashboards should be useful but simple.

## Employee Dashboard

Possible information:

- Pending request count
- Approved request count
- Rejected request count
- Recent leave requests

## Administrator Dashboard

Possible information:

- Pending request count
- Approved request count
- Rejected request count
- Recent submitted requests

Charts are **not required**.

Do not spend practical-exam time on analytics before all core requirements are complete.

---

# Features That Are Out of Scope Unless Time Remains

Do not prioritize the following:

- email notifications;
- PDF reports;
- complex employee management;
- leave balance accounting;
- holiday calendars;
- half-day calculations;
- multi-level approval;
- department management;
- calendar visualization;
- request attachments;
- complex audit-log UI;
- analytics dashboards;
- charts;
- real-time notifications.

Only consider extra features after:

1. all minimum requirements work;
2. authorization is secure;
3. validation is complete;
4. testing passes; and
5. the application is successfully deployed.

---



# Seed / Evaluation Accounts

The submitted application must contain working credentials for at least:

- one Employee account;
- one Administrator / Approver account.

Seed accounts should be easy for the evaluator to use.

Do not expose real or sensitive credentials in source control.

Evaluation credentials should be included only in the appropriate submission/usage notes or deployment configuration.

Representative seeded leave types may include:

- Vacation Leave
- Sick Leave
- Emergency Leave

Representative request data is useful for demonstrating Pending, Approved, and Rejected states.

---


# Coding Principles for This Assessment

When generating or modifying code for this project:

- Follow the existing Laravel application conventions.
- Inspect existing code before creating parallel abstractions.
- Keep controllers and components focused.
- Use Eloquent relationships rather than unnecessary manual joins.
- Use server-side authorization for protected actions.
- Validate all user-controlled input.
- Never trust role, user ownership, reviewer identity, or request status supplied by the client.
- Prefer named routes and Laravel route model binding where appropriate.
- Keep Inertia pages thin and use Laravel for authoritative business rules.
- Reuse existing TypeScript types and shared components when appropriate.
- Use shadcn/ui primitives consistently rather than inventing unrelated UI systems.
- Preserve accessibility: labels, keyboard operation, status text, and semantic controls.
- Avoid premature abstractions.
- Avoid unnecessary dependencies.
- Do not implement features beyond the assessment scope unless the core system is already dependable.
- Write or update tests whenever business-critical behavior changes.

---

# Final Guiding Principle

This is a practical assessment, not an attempt to build an enterprise HR platform.

Prefer a:

> **small, secure, predictable, well-tested, polished, and fully deployed system**

over a larger system containing incomplete or unreliable features.
