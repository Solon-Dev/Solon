# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-18 - String Allocations in Loops
**Learning:** Calling `toLowerCase()` on full file paths inside a regex parsing loop allocates large strings unnecessarily, increasing memory pressure and overhead.
**Action:** Avoid full-string manipulations inside loops; instead, extract only the required substring (like an extension using `lastIndexOf`) and process that smaller slice.
