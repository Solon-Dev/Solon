## 2024-05-23 - Secure ID Generation
**Vulnerability:** Weak ID generation using `Math.random().toString()`
**Learning:** `Math.random()` is not cryptographically secure and can lead to predictable IDs or collisions, making it unsuitable for generating user IDs or security tokens.
**Prevention:** Always use `crypto.randomUUID()` (Node.js) or `crypto.getRandomValues()` (Browser) for generating unique identifiers or security-sensitive random values. In Node.js environments, ensure `randomUUID` is imported from `crypto`.
