## 2025-05-20 - Regex Loop Optimization
**Learning:** For parsing large strings (like git diffs) to detect properties (like language), using a single `exec` loop with immediate processing and early exit allows avoiding full string traversal and array allocation. In "mixed" language scenarios, this yielded an 800x speedup by stopping processing as soon as the result was determined.
**Action:** When parsing large text blobs for classification, always prefer single-pass state machine loops over "extract then process" patterns, and implement early exit conditions where possible.
