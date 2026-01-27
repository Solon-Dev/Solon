# Sentinel's Journal 🛡️

This file tracks critical security learnings, vulnerabilities specific to this codebase, and important security decisions.

## Format
`## YYYY-MM-DD - [Title]`
`**Vulnerability:** [What you found]`
`**Learning:** [Why it existed]`
`**Prevention:** [How to avoid next time]`

## 2024-05-24 - Missing DoS Protection on Analysis Endpoint
**Vulnerability:** The `POST /api/analyze` endpoint was missing the documented 500,000 character limit on the `diff` input, allowing potentially unlimited payloads to be processed.
**Learning:** Documentation or requirements in memory were not reflected in the actual code implementation.
**Prevention:** Always verify security controls via automated tests (added regression test in `route.test.ts`).
