## 2024-05-23 - Regex Compilation and Array Allocation
**Learning:** Compiling regex inside a frequently called function and creating intermediate arrays for simple counting tasks can significantly impact performance in hot paths.
**Action:** Move regex literals to module scope if they don't depend on function arguments. Avoid collecting items into an array if you only need to iterate over them once to compute a result; process them as you find them.
