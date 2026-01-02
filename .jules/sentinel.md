## 2024-05-23 - Prevent Stack Trace Leakage in API
**Vulnerability:** The `/api/analyze` endpoint was returning full stack traces in the JSON response when an error occurred. This information leakage could help an attacker understand the server's internal structure and dependencies.
**Learning:** Even internal-facing APIs or those in development should catch errors and sanitize the output before sending it to the client. Using `error.stack` directly in response objects is a common but dangerous pattern.
**Prevention:** Always sanitize error responses. Log the full error (including stack trace) on the server side (e.g., using `console.error` or a logging service) but return only a generic error message or a sanitized description to the client.
