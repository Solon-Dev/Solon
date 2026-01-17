## 2024-05-22 - Single-Pass Regex with Early Exit
**Learning:** For large string processing tasks like diff analysis, avoiding intermediate array allocations (`filePaths`) and implementing early exit strategies (e.g., returning 'mixed' immediately) can significantly reduce memory usage and CPU cycles.
**Action:** When processing large inputs where the result can be determined early or aggregated in a single pass, prefer stateful loops over collecting all matches first.
