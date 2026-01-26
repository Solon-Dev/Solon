# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-18 - String Allocation in Loops
**Learning:** Avoiding large string allocations (like `match[1]` in regex or `toLowerCase()`) inside loops significantly reduces memory pressure and execution time. Capturing only the necessary substring (e.g. extension) with regex is faster.
**Action:** Use specific capture groups in regex to extract only what is needed, and avoid allocating new strings (like `path.toLowerCase()`) when a substring check suffices.
