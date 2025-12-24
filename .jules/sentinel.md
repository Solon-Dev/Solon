## 2024-04-18 - [Information Leakage in API Routes]
**Vulnerability:** API error handlers were returning full stack traces in JSON responses to the client.
**Learning:** `src/app/api/analyze/route.ts` included a `stack` property in its error response object, explicitly passing `error.stack` to it.
**Prevention:** API error responses should be sanitized. Stack traces should be logged server-side (e.g., `console.error`) but never returned in the API response payload. Defined strict interfaces for error responses that exclude sensitive fields.
