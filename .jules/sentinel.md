## 2025-05-23 - [Input Size Limits]
**Vulnerability:** Missing input size limit on the `diff` parameter in `/api/analyze` allowed for potential Denial of Service (DoS) attacks via memory exhaustion or processing timeouts.
**Learning:** Even if memory or documentation suggests a security control exists, it must be verified in code. The codebase lacked the limit described in the system memory.
**Prevention:** Always implement explicit input size validation for large text payloads at the API entry point and verify with regression tests.
