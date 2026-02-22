# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-20 - Avoid Full String Lowercasing for Extension Checks
**Learning:** When checking file extensions in a loop, `path.toLowerCase()` allocates a new string for the entire path, which is inefficient (O(N) memory allocation).
**Action:** Extract the extension first using `lastIndexOf` and slice, then lowercase only the extension (O(1) memory allocation relative to path length).
