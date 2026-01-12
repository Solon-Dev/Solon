## 2024-03-24 - API Error Leakage
**Vulnerability:** The API endpoint `/api/analyze` was catching errors and returning the full `error.stack` in the JSON response to the client.
**Learning:** Default error handling in `try/catch` blocks often inadvertently exposes internal implementation details (stack traces, file paths) which can be used by attackers to map the application structure or find dependencies.
**Prevention:** Always sanitize error objects before sending them to the client. Log the full error (including stack trace) to the server console (`console.error`) for debugging, but only return a generic error message or the `error.message` (if safe) to the client.
