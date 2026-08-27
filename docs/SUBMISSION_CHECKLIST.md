# Deployment Requirements

Deployment is part of the assessment.

The deployed application and required submission details must remain **accessible throughout the evaluation period**.

Before submission verify the deployed environment, not only local development.

Check:

- deployed URL loads;
- Employee login works;
- Administrator login works;
- logout works;
- database reads/writes work;
- leave request creation works;
- editing/deleting Pending requests works;
- approval/rejection works;
- leave type CRUD works;
- filters work;
- authorization restrictions work;
- frontend assets load correctly;
- no development/debug output is exposed;
- production migrations have been applied;
- required seed/demo accounts exist;
- the deployment will stay available for the full evaluation period.

Production must not expose Laravel debug information.

---

# Submission Requirements

The assessment submission must include:

1. The deployed system link.
2. Working login credentials for at least one Employee account.
3. Working login credentials for at least one Administrator / Approver account.
4. A short implementation summary of **three to five paragraphs**.
5. Any brief usage notes necessary for the evaluator to access or test the system.

---

# Implementation Summary Notes

The final implementation summary must describe:

- the development approach;
- the main features completed;
- important decisions made;
- assumptions made for unclear requirements;
- challenges encountered;
- how those challenges were addressed;
- how the system was tested and confirmed to work.

The following current assumptions should be mentioned:

- users authenticate with email and password;
- leave requests are initiated by employees;
- Administrator / Approver accounts review submitted requests;
- Approved and Rejected decisions are final;
- employees may edit or delete only Pending requests.

Add any later assumptions to this list as development progresses.

---
