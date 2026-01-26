## 2025-01-26 - [DoS Risk in Diff Analysis]
**Vulnerability:** The `diff` input in `/api/analyze` was unbounded, allowing potentially unlimited string length to be processed by regex and sent to external API.
**Learning:** Even with serverless functions (like Vercel), input size limits are critical to prevent resource exhaustion and cost spikes (LLM tokens).
**Prevention:** Enforced a 500,000 character limit on the `diff` input before processing.
