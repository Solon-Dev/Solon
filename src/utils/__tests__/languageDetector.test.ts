
import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  it('should return javascript when no language is detected', () => {
    const diff = 'diff --git a/README.md b/README.md\n...';
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect typescript from .ts files', () => {
    const diff = `
diff --git a/src/utils.ts b/src/utils.ts
index abc..def 100644
--- a/src/utils.ts
+++ b/src/utils.ts
@@ -1,3 +1,3 @@
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should detect javascript from .js files', () => {
    const diff = `
diff --git a/src/index.js b/src/index.js
index abc..def 100644
--- a/src/index.js
+++ b/src/index.js
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect python from .py files', () => {
    const diff = `
diff --git a/script.py b/script.py
`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('should detect rust from .rs files', () => {
    const diff = `
diff --git a/main.rs b/main.rs
`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('should return mixed when multiple languages are present', () => {
    const diff = `
diff --git a/src/utils.ts b/src/utils.ts
...
diff --git a/src/index.js b/src/index.js
...
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should return mixed even if one language has more files', () => {
    const diff = `
diff --git a/file1.ts b/file1.ts
...
diff --git a/file2.ts b/file2.ts
...
diff --git a/script.py b/script.py
...
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should be case insensitive', () => {
    const diff = `
diff --git a/FILE.TS b/FILE.TS
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });
});
