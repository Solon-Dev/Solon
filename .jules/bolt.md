## 2024-03-24 - Single Pass Regex Loops

**Learning:** Combining regex iteration with data processing in a single pass can significantly simplify code and allow for early exits, reducing worst-case performance on large inputs.
**Action:** When parsing data with regex loops (e.g., `exec` in a `while` loop), look for opportunities to process matches immediately rather than collecting them all first. This enables `O(1)` space complexity relative to matches and `O(k)` time complexity where `k` is the index of the decisive match, rather than always `O(n)`.
