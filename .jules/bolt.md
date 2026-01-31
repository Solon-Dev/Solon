# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-19 - String Allocation in Loops
**Learning:** Avoiding `toLowerCase()` on full strings inside loops drastically reduces memory allocation and execution time. Extracting the relevant substring (e.g., extension) and operating on that is O(1) vs O(N).
**Action:** When inspecting file paths or large strings in a loop, always extract the small part needed before transforming it.
