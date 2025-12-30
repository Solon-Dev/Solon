## 2024-05-23 - Array Modification During Iteration
**Learning:** Modifying an array (using `splice`) while iterating over it (with `forEach` or `for` loop) is a critical anti-pattern. It leads to O(n²) complexity and correctness bugs where elements are skipped due to index shifting.
**Action:** Always use `filter` to remove elements from an array. It creates a new array in O(n) time and guarantees safe, correct iteration.
