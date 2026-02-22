## 2025-05-15 - Safe String Replacement in Prompt Templates
**Vulnerability:** User input containing `$` characters (e.g., `$&`) caused unexpected behavior when inserted into prompt templates using `String.prototype.replace(string, string)`.
**Learning:** The `replace` method interprets special patterns in the replacement string (like `$&` for the matched substring), which can corrupt the prompt or lead to confusing behavior when handling code diffs that often contain `$`.
**Prevention:** Always use the callback form `replace(search, () => replacement)` when inserting untrusted or arbitrary strings, to ensure the replacement is treated literally.
