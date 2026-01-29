# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-24 - String Allocation in Loops
**Learning:** In loops processing thousands of iterations (like diff parsing), `path.toLowerCase()` creates a new string for every iteration, causing significant GC pressure. Using `lastIndexOf` to isolate the extension and only lowercasing that small substring combined with O(1) map lookup yielded ~20% performance improvement.
**Action:** When inspecting file paths in hot loops, avoid transforming the entire string. Extract and transform only the necessary substring (extension) for comparison.
