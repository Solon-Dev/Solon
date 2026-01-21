## 2024-05-22 - [Leakage of Stack Traces in API Responses]
**Vulnerability:** The API error handler in `src/app/api/analyze/route.ts` was returning the full stack trace to the client in the `stack` property of the JSON response.
**Learning:** Default error objects or copied error objects often include the stack trace, which is useful for debugging but dangerous for production APIs.
**Prevention:** Explicitly destructure and exclude sensitive fields like `stack` before sending error responses to the client. Use server-side logging (`console.error`) for debugging information.
