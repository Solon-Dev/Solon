## 2024-05-24 - Insecure ID Generation

**Vulnerability:** Use of `Math.random()` for generating user IDs, which is predictable and not collision-resistant.
**Learning:** `Math.random()` is not cryptographically secure.
**Prevention:** Use `crypto.randomUUID()` for generating UUIDs or `crypto.getRandomValues()` for other random values in security-sensitive contexts.
