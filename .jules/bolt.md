# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2026-03-15 - Minimal Substring Extraction for File Paths
**Learning:** Lowercasing full file paths inside a loop for extension checking results in unnecessary O(N) memory allocation and processing time, especially with deeply nested or long paths.
**Action:** Extract the minimal needed substring (e.g., using `lastIndexOf('.')` and `.substring()`) *before* lowercasing to significantly reduce string allocation overhead.
