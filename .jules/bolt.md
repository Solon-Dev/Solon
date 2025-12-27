## 2024-05-23 - Single-Pass Regex Optimization
**Learning:** Extracting all matches from a string using `regex.exec` into an intermediate array before processing them doubles the memory allocation and iteration overhead.
**Action:** When parsing large text blocks (like git diffs) with regex, process the matches immediately inside the `while` loop to avoid O(N) auxiliary space and O(N) extra iteration.
