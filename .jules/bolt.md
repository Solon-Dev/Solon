## 2024-05-22 - Single-pass Regex Optimization
**Learning:** For large string inputs (like git diffs), extracting all matches into an array before processing is memory-inefficient and prevents early exit.
**Action:** Use `regex.exec()` in a `while` loop to process matches on-the-fly. This allows O(1) memory for the match queue and enables O(1) early exit (e.g., detecting 'mixed' language immediately after finding a second language type).
