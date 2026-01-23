# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-18 - Optimized Regex Pattern Matching
**Learning:** When parsing large text (like git diffs) for specific patterns, using a highly specific regex (e.g., matching only valid extensions `\.(ts|js|...)`) instead of a generic capture (e.g., `(.+)`) coupled with string checks reduces processing time significantly by skipping irrelevant matches entirely within the regex engine.
**Action:** Optimize regex patterns to filter out irrelevant data at the matching stage rather than filtering in the application logic loop.
