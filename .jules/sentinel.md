## 2026-01-20 - API Error Stack Leakage
**Vulnerability:** API endpoints were returning full stack traces in the JSON response when an error occurred, exposing internal file paths and implementation details.
**Learning:** Default error handling in `try/catch` blocks often includes the stack trace in the error object or manual construction, which can be inadvertently sent to the client.
**Prevention:** Ensure that error responses sent to the client are sanitized. Log the full stack trace server-side (using `console.error` or a logging service) but only return a generic error message or the error message string (without stack) to the client.
