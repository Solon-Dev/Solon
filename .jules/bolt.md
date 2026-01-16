## 2024-05-22 - Regex Loop Optimization
**Learning:** Single-pass regex loops (`while ((match = regex.exec(str)) !== null)`) with early exit strategies are significantly faster (~80% in mixed cases) and more memory efficient than extracting all matches into an array first, especially for large string inputs.
**Action:** Prefer single-pass regex iteration when processing large text data where full extraction isn't strictly necessary or when an early decision can be made.
