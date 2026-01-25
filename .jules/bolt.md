# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-18 - Optimized String Matching
**Learning:** Extracting and lowercasing only the relevant substring (extension) is significantly faster than lowercasing the entire string for comparison, especially for long paths.
**Action:** Use `str.slice(index).toLowerCase()` instead of `str.toLowerCase().endsWith()` when checking suffixes on potentially long strings.
