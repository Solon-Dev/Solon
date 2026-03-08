## 2025-05-18 - Ensure Security Defenses Fail Securely Without Introducing New Errors
**Vulnerability:** A missing variable definition (`diagnostics`) within a DoS size limitation check for incoming Git diffs caused the Node.js application to throw a `ReferenceError`. Because this error was caught by the general top-level `catch` block which returned a 500 error, it masked the intended 413 error (Payload Too Large) and potentially leaked stack traces, undermining the security control's clarity.
**Learning:** Security mechanisms, such as DoS prevention blocks, must be meticulously tested to ensure they don't introduce basic syntax or reference errors themselves. A defense mechanism that errors out unexpectedly can obscure the attack and create confusion for debugging or incident response.
**Prevention:**
- Use TypeScript properly; ensure variables referenced in responses are actually defined within the scope of the error return statement.
- Write unit tests specifically targeting the activation of security boundaries (like the oversized payload test) to catch these fundamental errors before deployment.
