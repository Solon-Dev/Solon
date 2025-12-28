import { detectLanguageFromDiff } from './languageDetector';

describe('detectLanguageFromDiff', () => {
  it('should detect typescript from tsx files', () => {
    const diff = `
diff --git a/src/components/UserProfile.tsx b/src/components/UserProfile.tsx
index 0000000..1234567
--- a/src/components/UserProfile.tsx
+++ b/src/components/UserProfile.tsx
@@ -0,0 +1,5 @@
+ import React from 'react';
    `;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should detect javascript from js files', () => {
    const diff = `
diff --git a/src/utils/helper.js b/src/utils/helper.js
index 0000000..1234567
--- a/src/utils/helper.js
+++ b/src/utils/helper.js
@@ -0,0 +1,5 @@
+ const x = 1;
    `;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect python from py files', () => {
    const diff = `
diff --git a/scripts/script.py b/scripts/script.py
index 0000000..1234567
--- a/scripts/script.py
+++ b/scripts/script.py
@@ -0,0 +1,5 @@
+ import os
    `;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('should detect rust from rs files', () => {
    const diff = `
diff --git a/src/main.rs b/src/main.rs
index 0000000..1234567
--- a/src/main.rs
+++ b/src/main.rs
@@ -0,0 +1,5 @@
+ fn main() {}
    `;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('should return mixed when multiple languages are present', () => {
    const diff = `
diff --git a/src/main.rs b/src/main.rs
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/main.rs
@@ -0,0 +1,5 @@
+ fn main() {}

diff --git a/scripts/script.py b/scripts/script.py
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/scripts/script.py
@@ -0,0 +1,5 @@
+ import os
    `;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should default to javascript if no supported language is found', () => {
    const diff = `
diff --git a/README.md b/README.md
index 0000000..1234567
--- a/README.md
+++ b/README.md
@@ -0,0 +1,5 @@
+ # Hello
    `;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should handle uppercase file extensions', () => {
    const diff = `
diff --git a/SRC/MAIN.TS b/SRC/MAIN.TS
index 0000000..1234567
--- a/SRC/MAIN.TS
+++ b/SRC/MAIN.TS
@@ -0,0 +1,5 @@
+ const x = 1;
    `;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should handle mixed extensions in javascript group', () => {
      const diff = `
diff --git a/file1.js b/file1.js
...
diff --git a/file2.mjs b/file2.mjs
...
      `;
      expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

    it('should correctly prioritize language counts', () => {
        // 2 TS files, 1 JS file -> should be typescript (wait, if mixed is returned for >1 language, then it should be mixed)
        // The original logic returns 'mixed' if >1 language types have count > 0.

        const diff = `
diff --git a/file1.ts b/file1.ts
...
diff --git a/file2.ts b/file2.ts
...
diff --git a/file3.js b/file3.js
...
        `;
        expect(detectLanguageFromDiff(diff)).toBe('mixed');
    });

    it('should return language with highest count if logic allowed it (but logic returns mixed)', () => {
         // The current implementation returns 'mixed' if more than one language category has > 0 files.
         // So even if I have 100 TS files and 1 JS file, it returns 'mixed'.
         const diff = `
diff --git a/file1.ts b/file1.ts
...
diff --git a/file2.js b/file2.js
...
         `;
         expect(detectLanguageFromDiff(diff)).toBe('mixed');
    });

    it('should return single language if multiple files of same language', () => {
        const diff = `
diff --git a/file1.ts b/file1.ts
...
diff --git a/file2.tsx b/file2.tsx
...
        `;
        expect(detectLanguageFromDiff(diff)).toBe('typescript');
    });
});
