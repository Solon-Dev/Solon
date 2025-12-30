## 2024-05-23 - [API Error Handling Leak]
**Vulnerability:** API error responses were leaking full stack traces to the client in the `stack` field of the JSON response.
**Learning:** Even with secure error message handling, explicitly adding a `stack` property to the response object bypasses standard protections. This was present in both the internal helper function `callClaudeAPI` and the main `POST` handler.
**Prevention:** Ensure that production error responses never include stack traces. Use a centralized error handling utility that sanitizes errors before sending them to the client.
