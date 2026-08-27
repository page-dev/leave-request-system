# Testing Priorities

Critical behavior should be covered by automated tests where practical.

At minimum, verify:

## Authentication

- Employee credentials can log in.
- Administrator / Approver credentials can log in.
- Users can log out.

## Authorization

- Employee cannot access admin-only functionality.
- Employee cannot view protected data belonging to another employee where access should be restricted.
- Employee cannot edit another employee's request.
- Employee cannot delete another employee's request.

## Leave Requests

- Employee can create a valid request.
- Invalid date ranges fail validation.
- New requests are Pending.
- Employee can edit a Pending request they own.
- Employee can delete a Pending request they own.
- Employee cannot edit an Approved request.
- Employee cannot edit a Rejected request.
- Employee cannot delete an Approved request.
- Employee cannot delete a Rejected request.

## Approval

- Admin can approve a Pending request.
- Admin can reject a Pending request.
- Admin cannot re-review an already Approved request.
- Admin cannot re-review an already Rejected request.
- Reviewer metadata is stored correctly if implemented.

## Leave Types

- Admin can create a leave type.
- Admin can view leave types.
- Admin can update a leave type.
- Admin can delete/deactivate a leave type according to the chosen integrity rule.
- Employee cannot manage leave types.

## Filtering

- Employee filters only within their own requests.
- Administrator filters produce the expected request set.

Prefer feature tests for application workflows.
