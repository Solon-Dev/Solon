## 2026-01-24 - Missing Input Validation Found via Memory/Code Discrepancy
**Vulnerability:** Missing input length validation on the `diff` parameter in `src/app/api/analyze/route.ts`, allowing for potential Denial of Service (DoS) via large payloads.
**Learning:** Documentation or "memory" about security controls (like a 500,000 character limit) can drift from the actual code. Always verify that stated security controls are actually implemented in the codebase.
**Prevention:** Implement automated regression tests for all security controls (like the one added for the 500k limit) to ensure they are not accidentally removed or forgotten.
