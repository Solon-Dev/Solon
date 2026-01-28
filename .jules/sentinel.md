## 2025-05-23 - [Input Size Limit for Analysis]
**Vulnerability:** The `/api/analyze` endpoint accepts arbitrary length strings for `diff`, which are then processed by regex-based language detection and sent to external APIs, leading to potential Denial of Service (DoS) via resource exhaustion or timeout.
**Learning:** Next.js Route Handlers do not automatically enforce strict body size limits suitable for heavy processing tasks like code analysis. Explicit application-level validation is required before processing.
**Prevention:** Implement explicit `MAX_DIFF_LENGTH` checks (e.g., 500KB) immediately after parsing the request body and before any processing or external API calls.
