## 2024-03-24 - Optimization of language detection

**Learning:** Optimizing `detectLanguageFromDiff` by switching from a two-pass approach (collect all matches -> count) to a single-pass approach with early exit significantly improved performance for mixed language diffs (from ~177ms to ~3ms for 10k files).
**Action:** When processing large strings or diffs, look for opportunities to combine extraction and processing steps, and always implement early exit conditions where possible. Avoid allocating large intermediate arrays when an iterator or streaming approach can be used.
