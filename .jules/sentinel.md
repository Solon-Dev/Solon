## 2024-05-23 - Missing Input Length Limit on API

**Vulnerability:** The `/api/analyze` endpoint accepted `diff` strings of arbitrary length, allowing potential Denial of Service (DoS) attacks via memory exhaustion or excessive processing costs.
**Learning:** Next.js API routes do not automatically enforce body size limits for parsed JSON in all configurations (or the limit is very high), and manual checks are necessary for specific business logic constraints (like context window limits).
**Prevention:** Explicitly define and check `MAX_DIFF_LENGTH` or similar constraints for all user inputs, especially those destined for external APIs or heavy processing.
