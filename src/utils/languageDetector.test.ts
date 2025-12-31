
import { detectLanguageFromDiff, SupportedLanguage } from './languageDetector';

describe('detectLanguageFromDiff', () => {
  it('should detect typescript from .ts and .tsx files', () => {
    const diff = `
diff --git a/src/app/page.tsx b/src/app/page.tsx
index 123456..789012 100644
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@ -1,5 +1,5 @@
diff --git a/src/utils/helper.ts b/src/utils/helper.ts
index 123456..789012 100644
--- a/src/utils/helper.ts
+++ b/src/utils/helper.ts
    `;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should detect javascript from .js and .jsx files', () => {
    const diff = `
diff --git a/src/script.js b/src/script.js
index 123456..789012 100644
--- a/src/script.js
+++ b/src/script.js
diff --git a/src/component.jsx b/src/component.jsx
index 123456..789012 100644
--- a/src/component.jsx
+++ b/src/component.jsx
    `;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect python from .py files', () => {
    const diff = `
diff --git a/src/script.py b/src/script.py
index 123456..789012 100644
--- a/src/script.py
+++ b/src/script.py
    `;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('should detect rust from .rs files', () => {
    const diff = `
diff --git a/src/main.rs b/src/main.rs
index 123456..789012 100644
--- a/src/main.rs
+++ b/src/main.rs
    `;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('should detect mixed language', () => {
    const diff = `
diff --git a/src/script.py b/src/script.py
index 123456..789012 100644
--- a/src/script.py
+++ b/src/script.py
diff --git a/src/main.rs b/src/main.rs
index 123456..789012 100644
--- a/src/main.rs
+++ b/src/main.rs
    `;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should return default javascript if no relevant files found', () => {
    const diff = `
diff --git a/README.md b/README.md
index 123456..789012 100644
--- a/README.md
+++ b/README.md
    `;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect language correctly with mixed case extensions', () => {
    const diff = `
diff --git a/src/SCRIPT.PY b/src/SCRIPT.PY
index 123456..789012 100644
--- a/src/SCRIPT.PY
+++ b/src/SCRIPT.PY
    `;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  // Performance test (manual check)
  it('should handle large diffs reasonably fast', () => {
     let largeDiff = '';
     for(let i=0; i<10000; i++) {
        largeDiff += `diff --git a/file${i}.ts b/file${i}.ts\n`;
     }
     const start = performance.now();
     expect(detectLanguageFromDiff(largeDiff)).toBe('typescript');
     const end = performance.now();
     // Just logging to see, not asserting on time strictly
     console.log(`Execution time: ${end - start}ms`);
  });
});
