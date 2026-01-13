## 2025-05-18 - Optimized detectLanguageFromDiff
**Learning:** The previous implementation of `detectLanguageFromDiff` was O(N) space and O(N) time (looping twice). By switching to a single-pass loop with early exit for mixed languages, we avoid unnecessary memory allocation and iteration, especially for large diffs.
**Action:** Always check for opportunities to reduce array allocations and combine loops when processing large strings or datasets.
