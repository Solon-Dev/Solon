# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2026-01-27 - String Allocation in Loops
**Learning:** Calling `toLowerCase()` on full file paths inside a loop creates unnecessary string allocations. Extracting just the extension (substring) and checking that is much more efficient.
**Action:** When classifying strings based on suffixes/extensions, extract the suffix first before normalizing case, and use a Map/Object for O(1) lookup instead of if-else chains.
