# Sentinel Journal

## 2024-05-24 - DoS Protection added
**Vulnerability:** The `analyze` endpoint accepted unlimited input size for the `diff` parameter.
**Learning:** Next.js API routes don't automatically limit JSON body size in a way that prevents application-level DoS when processing large strings.
**Prevention:** Explicitly check input length for large string parameters before processing. Added 500kb limit.
