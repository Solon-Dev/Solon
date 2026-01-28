# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-18 - String Allocation Avoidance in Hot Loops
**Learning:** When processing many strings in a loop (like file paths in a diff), avoid `toLowerCase()` on the entire string if you only need to check a suffix. Extracting the suffix and checking a Map is faster and generates less garbage.
**Action:** Use `slice` + small `toLowerCase` + Map lookup instead of full string `toLowerCase` + multiple `endsWith` checks.
