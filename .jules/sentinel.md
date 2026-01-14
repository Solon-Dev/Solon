## 2025-05-18 - API Error Handling Leaks Stack Traces
**Vulnerability:** `src/app/api/analyze/route.ts` was returning full stack traces in JSON responses to the client when errors occurred.
**Learning:** The internal utility function `callClaudeAPI` returned error objects containing `stack`, and the API route handler blindly spread this object (`...analysis`) into the JSON response. Additionally, the outer try/catch block explicitly included `stack` in the response.
**Prevention:**
1. Never pass error objects directly to client responses.
2. Explicitly select safe fields (e.g., `error`, `message`) for the response.
3. Log stack traces to server-side logs (`console.error`) instead of returning them.
