# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-18 - Avoid Full String Allocations for Suffix Checks
**Learning:** When checking file extensions or suffixes in a loop (e.g., parsing git diffs), using `path.toLowerCase().endsWith(...)` allocates a new string for every path, which is O(N*M) where N is number of paths and M is path length.
**Action:** Use `lastIndexOf` to find the separator, extract only the suffix, lowercase it, and compare. This reduces allocation to O(N*K) where K is the small extension length.
