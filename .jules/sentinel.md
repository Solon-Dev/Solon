## 2024-05-23 - Prevent Stack Trace Leaks
**Vulnerability:** The API route `src/app/api/analyze/route.ts` was returning full stack traces to the client in JSON responses when errors occurred. This exposed internal implementation details and file paths.
**Learning:** Even with generic error messages, re-throwing or passing `error.stack` to the client response is a common oversight. Security conventions must explicitly forbid this.
**Prevention:** Always sanitize error objects before sending them to the client. Use server-side logging (`console.error`) for debugging information and return only generic error messages to the client. Added `/** @jest-environment node */` to tests for Route Handlers to properly mock Next.js server objects.
