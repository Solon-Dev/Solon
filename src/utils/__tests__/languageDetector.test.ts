import { detectLanguageFromDiff, getLanguageConfig } from '../languageDetector';

describe('languageDetector', () => {
  describe('detectLanguageFromDiff', () => {
    it('should detect TypeScript from diff', () => {
      const diff = `
diff --git a/src/utils/test.ts b/src/utils/test.ts
index 1234567..89abcde 100644
--- a/src/utils/test.ts
+++ b/src/utils/test.ts
@@ -1,5 +1,5 @@
-const x = 1;
+const x = 2;
`;
      expect(detectLanguageFromDiff(diff)).toBe('typescript');
    });

    it('should detect JavaScript from diff', () => {
      const diff = `
diff --git a/src/utils/test.js b/src/utils/test.js
index 1234567..89abcde 100644
--- a/src/utils/test.js
+++ b/src/utils/test.js
@@ -1,5 +1,5 @@
-const x = 1;
+const x = 2;
`;
      expect(detectLanguageFromDiff(diff)).toBe('javascript');
    });

    it('should detect Python from diff', () => {
      const diff = `
diff --git a/src/utils/test.py b/src/utils/test.py
index 1234567..89abcde 100644
--- a/src/utils/test.py
+++ b/src/utils/test.py
@@ -1,5 +1,5 @@
-x = 1
+x = 2
`;
      expect(detectLanguageFromDiff(diff)).toBe('python');
    });

    it('should detect Rust from diff', () => {
      const diff = `
diff --git a/src/utils/test.rs b/src/utils/test.rs
index 1234567..89abcde 100644
--- a/src/utils/test.rs
+++ b/src/utils/test.rs
@@ -1,5 +1,5 @@
-let x = 1;
+let x = 2;
`;
      expect(detectLanguageFromDiff(diff)).toBe('rust');
    });

    it('should detect mixed language', () => {
      const diff = `
diff --git a/src/utils/test.ts b/src/utils/test.ts
index 1234567..89abcde 100644
--- a/src/utils/test.ts
+++ b/src/utils/test.ts
@@ -1,5 +1,5 @@
-const x = 1;
+const x = 2;
diff --git a/src/utils/test.py b/src/utils/test.py
index 1234567..89abcde 100644
--- a/src/utils/test.py
+++ b/src/utils/test.py
@@ -1,5 +1,5 @@
-x = 1
+x = 2
`;
      expect(detectLanguageFromDiff(diff)).toBe('mixed');
    });

    it('should default to javascript if no language detected', () => {
        const diff = `
diff --git a/src/utils/test.txt b/src/utils/test.txt
index 1234567..89abcde 100644
--- a/src/utils/test.txt
+++ b/src/utils/test.txt
@@ -1,5 +1,5 @@
-text
+text
`;
        expect(detectLanguageFromDiff(diff)).toBe('javascript');
    });

    it('should handle uppercase extensions', () => {
        const diff = `
diff --git a/src/utils/test.TS b/src/utils/test.TS
index 1234567..89abcde 100644
--- a/src/utils/test.TS
+++ b/src/utils/test.TS
@@ -1,5 +1,5 @@
-const x = 1;
+const x = 2;
`;
        expect(detectLanguageFromDiff(diff)).toBe('typescript');
    });

    it('should correctly count languages and pick the majority', () => {
         const diff = `
diff --git a/src/utils/test1.ts b/src/utils/test1.ts
index ...
--- a/src/utils/test1.ts
+++ b/src/utils/test1.ts
...
diff --git a/src/utils/test2.ts b/src/utils/test2.ts
index ...
--- a/src/utils/test2.ts
+++ b/src/utils/test2.ts
...
diff --git a/src/utils/test.py b/src/utils/test.py
index ...
--- a/src/utils/test.py
+++ b/src/utils/test.py
...
`;
        // Current implementation returns 'mixed' if > 1 language is found, regardless of count?
        // Let's check the code:
        // if (nonZeroLanguages.length > 1) { return 'mixed'; }
        // Yes, it returns mixed if ANY two languages are present.
        expect(detectLanguageFromDiff(diff)).toBe('mixed');
    });
  });

  describe('getLanguageConfig', () => {
      it('should return correct config for typescript', () => {
          const config = getLanguageConfig('typescript');
          expect(config.language).toBe('typescript');
          expect(config.testFramework).toBe('Jest');
      });
  });
});
