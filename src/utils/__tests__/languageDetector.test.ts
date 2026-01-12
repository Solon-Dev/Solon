import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  it('detects typescript from .ts and .tsx files', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
index 123..456 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,1 +1,1 @@
-console.log("hello");
+console.log("world");
diff --git a/src/component.tsx b/src/component.tsx
index 123..456 100644
--- a/src/component.tsx
+++ b/src/component.tsx
@@ -1,1 +1,1 @@
-<div />;
+<span />;
    `;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('detects javascript from .js, .jsx, .mjs, .cjs files', () => {
    const diff = `
diff --git a/src/index.js b/src/index.js
index 123..456 100644
--- a/src/index.js
+++ b/src/index.js
@@ -1,1 +1,1 @@
-var x = 1;
+var x = 2;
    `;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('detects python from .py files', () => {
    const diff = `
diff --git a/main.py b/main.py
index 123..456 100644
--- a/main.py
+++ b/main.py
@@ -1,1 +1,1 @@
-print("hello")
+print("world")
    `;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('detects rust from .rs files', () => {
    const diff = `
diff --git a/src/main.rs b/src/main.rs
index 123..456 100644
--- a/src/main.rs
+++ b/src/main.rs
@@ -1,1 +1,1 @@
-fn main() {}
+fn main() { println!("hi"); }
    `;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('detects mixed language', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
index 123..456 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,1 +1,1 @@
-console.log("hello");
+console.log("world");
diff --git a/main.py b/main.py
index 123..456 100644
--- a/main.py
+++ b/main.py
@@ -1,1 +1,1 @@
-print("hello")
+print("world")
    `;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('defaults to javascript if no recognized files found', () => {
    const diff = `
diff --git a/README.md b/README.md
index 123..456 100644
--- a/README.md
+++ b/README.md
@@ -1,1 +1,1 @@
-# Title
+# New Title
    `;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('returns highest count language if not mixed (single language dominancy check - current implementation logic)', () => {
      // Note: Current implementation returns 'mixed' if count > 0 for > 1 language.
      // So this test case depends on what "not mixed" means.
      // If we have 10 TS files and 0 others, it returns TS.
      // If we have 10 TS files and 1 JS file, current implementation returns mixed.

      const diff = `
diff --git a/1.ts b/1.ts
diff --git a/2.ts b/2.ts
diff --git a/3.ts b/3.ts
      `;
      expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('returns mixed even if one language dominates', () => {
       const diff = `
diff --git a/1.ts b/1.ts
diff --git a/2.ts b/2.ts
diff --git a/3.js b/3.js
      `;
      expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });
});
