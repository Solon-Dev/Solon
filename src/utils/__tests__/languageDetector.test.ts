import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  it('should detect typescript', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
index 83a21...23b21 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,4 +1,4 @@
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should detect javascript', () => {
    const diff = `
diff --git a/src/index.js b/src/index.js
index 83a21...23b21 100644
--- a/src/index.js
+++ b/src/index.js
@@ -1,4 +1,4 @@
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect python', () => {
    const diff = `
diff --git a/script.py b/script.py
index 83a21...23b21 100644
--- a/script.py
+++ b/script.py
@@ -1,4 +1,4 @@
`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('should detect rust', () => {
    const diff = `
diff --git a/main.rs b/main.rs
index 83a21...23b21 100644
--- a/main.rs
+++ b/main.rs
@@ -1,4 +1,4 @@
`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('should detect mixed language', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,4 +1,4 @@
diff --git a/script.py b/script.py
--- a/script.py
+++ b/script.py
@@ -1,4 +1,4 @@
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should default to javascript if no language detected', () => {
    const diff = `
diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should handle large diffs efficiently', () => {
      // Create a large diff
      let largeDiff = '';
      for (let i = 0; i < 5000; i++) {
          largeDiff += `diff --git a/file${i}.ts b/file${i}.ts\n`;
          largeDiff += `--- a/file${i}.ts\n`;
          largeDiff += `+++ b/file${i}.ts\n`;
      }

      const result = detectLanguageFromDiff(largeDiff);
      expect(result).toBe('typescript');
  });

  it('should handle large mixed diffs efficiently', () => {
      // Create a large mixed diff
      let largeDiff = '';
      // First file is TS
      largeDiff += `diff --git a/file0.ts b/file0.ts\n--- a/file0.ts\n+++ b/file0.ts\n`;
      // Second file is JS (should trigger mixed immediately with optimization)
      largeDiff += `diff --git a/file1.js b/file1.js\n--- a/file1.js\n+++ b/file1.js\n`;

      // Add more to simulate large payload
       for (let i = 2; i < 5000; i++) {
          largeDiff += `diff --git a/file${i}.ts b/file${i}.ts\n`;
          largeDiff += `--- a/file${i}.ts\n`;
          largeDiff += `+++ b/file${i}.ts\n`;
      }

      const result = detectLanguageFromDiff(largeDiff);
      expect(result).toBe('mixed');
  });
});
