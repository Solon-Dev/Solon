## 2024-05-22 - Regex Loop Optimization
**Learning:** For large string inputs (like git diffs), extracting all matches into an array before processing causes unnecessary memory allocation (O(N)). Using a single-pass regex loop (`exec`) with immediate processing allows for O(1) memory usage and enables early exit strategies.
**Action:** When parsing large text with regex, process matches iteratively and exit as soon as the result is determined.
