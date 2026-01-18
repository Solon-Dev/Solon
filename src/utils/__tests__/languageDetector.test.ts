
import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  it('detects typescript from single file diff', () => {
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

  it('detects javascript from .js files', () => {
    const diff = `
diff --git a/script.js b/script.js
--- a/script.js
+++ b/script.js
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('detects python from .py files', () => {
    const diff = `
diff --git a/app.py b/app.py
--- a/app.py
+++ b/app.py
`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('detects rust from .rs files', () => {
    const diff = `
diff --git a/main.rs b/main.rs
--- a/main.rs
+++ b/main.rs
`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('detects mixed language when multiple languages are present', () => {
    const diff = `
diff --git a/src/app.ts b/src/app.ts
--- a/src/app.ts
+++ b/src/app.ts
@@ ... @@
diff --git a/scripts/setup.py b/scripts/setup.py
--- a/scripts/setup.py
+++ b/scripts/setup.py
@@ ... @@
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('defaults to javascript if no recognized files found', () => {
    const diff = `
diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('defaults to javascript for empty diff', () => {
    expect(detectLanguageFromDiff('')).toBe('javascript');
  });

  it('detects typescript from .tsx files', () => {
    const diff = `diff --git a/comp.tsx b/comp.tsx`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('detects javascript from .jsx files', () => {
    const diff = `diff --git a/comp.jsx b/comp.jsx`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('detects mixed even if one language has more files', () => {
    // 3 TS files, 1 Python file -> Should be mixed
    const diff = `
diff --git a/1.ts b/1.ts
diff --git a/2.ts b/2.ts
diff --git a/3.ts b/3.ts
diff --git a/script.py b/script.py
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('handles deeply nested paths', () => {
    const diff = `diff --git a/very/deeply/nested/path/to/file.rs b/very/deeply/nested/path/to/file.rs`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });
});
