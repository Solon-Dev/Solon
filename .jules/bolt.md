## 2024-05-22 - Regex Recompilation Cost
**Learning:** Hoisting a regex out of a frequently called function in a tight loop reduced execution time by ~20% (301ms -> ~250ms for 100k iterations).
**Action:** Always check if regexes in hot paths can be hoisted to module scope.
