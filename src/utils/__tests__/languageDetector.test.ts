
import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  it('detects typescript', () => {
    const diff = `diff --git a/src/index.ts b/src/index.ts
index 83a04f2..5e5108f 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,5 +1,5 @@
-console.log("hello");
+console.log("world");`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('detects javascript', () => {
    const diff = `diff --git a/src/script.js b/src/script.js
index 83a04f2..5e5108f 100644
--- a/src/script.js
+++ b/src/script.js`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('detects python', () => {
    const diff = `diff --git a/script.py b/script.py
index 83a04f2..5e5108f 100644
--- a/script.py
+++ b/script.py`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('detects rust', () => {
    const diff = `diff --git a/main.rs b/main.rs
index 83a04f2..5e5108f 100644
--- a/main.rs
+++ b/main.rs`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('detects mixed content', () => {
    const diff = `diff --git a/src/index.ts b/src/index.ts
index 83a04f2..5e5108f 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1 +1 @@
-x
+y
diff --git a/script.py b/script.py
index 83a04f2..5e5108f 100644
--- a/script.py
+++ b/script.py`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('defaults to javascript if no recognized files', () => {
    const diff = `diff --git a/readme.md b/readme.md
index 83a04f2..5e5108f 100644
--- a/readme.md
+++ b/readme.md`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('handles empty diff', () => {
    expect(detectLanguageFromDiff('')).toBe('javascript');
  });
});
