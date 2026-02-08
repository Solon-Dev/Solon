# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-24 - File Path Extension Extraction
**Learning:** Checking file extensions by extracting the substring after the last dot is more efficient than lowercasing the entire path string, especially for long paths in hot loops like diff parsing.
**Action:** Prefer `path.substring(path.lastIndexOf('.')).toLowerCase()` over `path.toLowerCase().endsWith(...)` when only the extension matters.
