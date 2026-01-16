## 2024-05-22 - API Error Object Leakage
**Vulnerability:** API endpoints were forwarding internal error objects containing stack traces directly to the client JSON response.
**Learning:** The application uses a pattern where internal helper functions return `{ error, stack }` objects, which were then spread into the response body via `...analysis`. This makes it easy to accidentally leak sensitive info like stack traces to the client.
**Prevention:** Always construct API error responses explicitly by selecting only safe fields (e.g., `error`, `details`), rather than spreading internal objects. Internal error details should be logged server-side only.
