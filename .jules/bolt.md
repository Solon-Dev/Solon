# Bolt's Journal

## 2025-05-18 - Efficient Regex Looping
**Learning:** For large string inputs, using a `while(regex.exec(str))` loop with a single pass is significantly faster and more memory efficient than `str.match(globalRegex)` or accumulating all matches into an array before processing.
**Action:** Always prefer single-pass regex loops with early exit strategies for parsing large text blocks, especially when the goal is detection rather than full extraction.

## 2025-05-18 - LLM JSON Extraction Pitfalls
**Learning:** Using native string methods like `lastIndexOf('}')` to extract JSON from LLM responses is unsafe. LLMs often append conversational text or code snippets *after* the JSON payload. A robust character-by-character brace-counting loop is necessary to safely identify the correct matching closing brace of the JSON object, ignoring any trailing non-JSON text. Optimization must not sacrifice this correctness.
**Action:** Never optimize LLM parsing logic by blindly replacing balanced delimiter parsing with simple string search methods like `lastIndexOf`.

## 2025-05-18 - O(1) Set Lookups Over O(N) Array Includes
**Learning:** When filtering a list against an array of strings (`array.includes()`), the time complexity is O(N*M). Converting the target array to a `Set` before filtering turns the `includes` check into a constant-time `has` check, yielding O(N) complexity overall.
**Action:** Always convert small arrays into Sets before performing repeated membership checks within loops or `filter`/`map` operations.
