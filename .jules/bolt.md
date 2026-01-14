## 2025-05-18 - Early Exit in Regex Loops
**Learning:** For large inputs like git diffs, processing the entire string to build an intermediate array before analysis is wasteful. Combining extraction and analysis into a single pass with early exit conditions (e.g., stopping once "mixed" language is confirmed) can yield massive performance gains (40x in this case).
**Action:** Always look for opportunities to process data in streams or single-pass loops rather than build-then-process, especially for potentially large string inputs.
