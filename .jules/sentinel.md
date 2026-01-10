## 2024-03-21 - [API Security] Stack Trace Leakage
**Vulnerability:** The API route `src/app/api/analyze/route.ts` was returning full stack traces in the `stack` property of the JSON response when an error occurred (both internal errors and Claude API failures).
**Learning:** Even with error handling in place (`try/catch`), simply passing the error object or its stack to the client exposes internal implementation details that can aid attackers.
**Prevention:** Always sanitize error objects before sending them to the client. Use `console.error` for internal logging of stack traces, and return generic error messages (e.g., "Internal server error") to the client. Ensure explicit removal of sensitive properties like `stack`.
