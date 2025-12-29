
import { detectLanguageFromDiff } from './languageDetector';

describe('detectLanguageFromDiff', () => {
  it('should detect TypeScript', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
index 1234567..89abcdef 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,5 +1,5 @@
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should detect JavaScript', () => {
    const diff = `
diff --git a/app.js b/app.js
index 1234567..89abcdef 100644
--- a/app.js
+++ b/app.js
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect Python', () => {
    const diff = `
diff --git a/script.py b/script.py
index 1234567..89abcdef 100644
--- a/script.py
+++ b/script.py
`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('should detect Rust', () => {
    const diff = `
diff --git a/main.rs b/main.rs
index 1234567..89abcdef 100644
--- a/main.rs
+++ b/main.rs
`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('should return mixed for multiple languages', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
...
diff --git a/script.py b/script.py
...
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should default to javascript for unknown files', () => {
    const diff = `
diff --git a/README.md b/README.md
...
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should handle complex diff headers', () => {
     const diff = `
diff --git a/src/components/Button.tsx b/src/components/Button.tsx
new file mode 100644
index 0000000..e69de29
--- /dev/null
+++ b/src/components/Button.tsx
@@ -0,0 +1,10 @@
+import React from 'react';
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should handle multiple files of same language', () => {
    const diff = `
diff --git a/file1.ts b/file1.ts
...
diff --git a/file2.ts b/file2.ts
...
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should return mixed if multiple languages are present', () => {
    // Existing logic returns 'mixed' if more than one language has non-zero count
    const diff = `
diff --git a/file1.ts b/file1.ts
...
diff --git a/file2.py b/file2.py
...
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });
});
