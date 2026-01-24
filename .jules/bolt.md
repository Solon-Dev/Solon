# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-18 - String Allocation in Loops
**Learning:** Calling string transformation methods like `toLowerCase()` on full strings inside a loop creates unnecessary memory allocations (O(N) * LoopCount). For checking suffixes/extensions, extracting the small substring first (O(k)) and transforming only that is much more efficient.
**Action:** When parsing file paths or large strings in loops, avoid full-string transformations. Extract the relevant substring (e.g., extension) before normalization.
