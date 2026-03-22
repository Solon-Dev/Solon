# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-18 - Avoid large string allocations inside loops
**Learning:** Using `.toLowerCase()` on long strings (like full file paths) within loops is computationally expensive due to large string allocations and processing. By using substring extraction with `lastIndexOf('.')` first, you reduce the string size operated on dramatically.
**Action:** When evaluating substrings (like file extensions), extract the specific substring before applying string manipulations like `.toLowerCase()`.