## 2024-05-23 - [Regex Loop Optimization]
**Learning:** Avoid intermediate arrays when processing large strings. Using a regex execution loop with immediate processing allowed for an "early exit" strategy in language detection, significantly reducing processing time for mixed-language diffs.
**Action:** When parsing large inputs, prefer single-pass processing loops over `matchAll` or extracting all matches into an array first.
