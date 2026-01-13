## 2024-03-24 - API Error Leakage and DoS Protection
**Vulnerability:** The API endpoint `src/app/api/analyze/route.ts` was leaking stack traces to the client in error responses. It also lacked input size validation for the git diff payload.
**Learning:** Default error handling patterns often expose internal details (stack traces) which can reveal sensitive information about the file structure and dependencies. Lack of input limits allows for Denial of Service via memory exhaustion.
**Prevention:**
1. Explicitly remove `stack` and sensitive details from API error responses before sending them to the client.
2. Log full error details (including stack traces) to the server console for debugging.
3. Implement strict input size limits (e.g., 100KB) for large text inputs like git diffs.
