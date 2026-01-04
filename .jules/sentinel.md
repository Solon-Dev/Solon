## 2024-05-23 - API Error Response Information Leakage
**Vulnerability:** API error responses were leaking full stack traces to the client in the `stack` field of the JSON response.
**Learning:** Default error handling in `try/catch` blocks often naively passes `error.stack` to the response object, especially in development-focused code that gets promoted to production.
**Prevention:** Always sanitize error objects before sending them to the client. Use a dedicated error formatter that strips sensitive fields like `stack` in production environments.
