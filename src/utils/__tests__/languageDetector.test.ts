import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  it('should default to javascript for empty diff', () => {
    expect(detectLanguageFromDiff('')).toBe('javascript');
  });

  it('should detect typescript', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
index 1234567..89abcdef 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,5 +1,5 @@
-console.log('hello');
+console.log('world');
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should detect mixed languages and return mixed', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
--- a/src/index.ts
+++ b/src/index.ts
@@ -1 +1 @@
-x
+y
diff --git a/src/script.py b/src/script.py
--- a/src/script.py
+++ b/src/script.py
@@ -1 +1 @@
-print(1)
+print(2)
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should detect python', () => {
      const diff = `
diff --git a/script.py b/script.py
--- a/script.py
+++ b/script.py
`;
      expect(detectLanguageFromDiff(diff)).toBe('python');
  });

    it('should detect rust', () => {
      const diff = `
diff --git a/main.rs b/main.rs
--- a/main.rs
+++ b/main.rs
`;
      expect(detectLanguageFromDiff(diff)).toBe('rust');
  });
});
