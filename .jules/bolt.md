# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2026-02-15 - String Allocation in Loops
**Learning:** Avoiding large string allocations (like `toLowerCase()` on full paths) within loops by using substring extraction (e.g. `lastIndexOf` + `substring`) can significantly improve performance for large datasets, even with modern JS engines.
**Action:** When processing strings in loops, always check if you can extract only the relevant part before performing expensive operations like case conversion.
