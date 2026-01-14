
import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  it('detects typescript', () => {
    const diff = `diff --git a/src/app.ts b/src/app.ts
index 123..456 100644
--- a/src/app.ts
+++ b/src/app.ts`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('detects javascript', () => {
    const diff = `diff --git a/src/app.js b/src/app.js
index 123..456 100644
--- a/src/app.js
+++ b/src/app.js`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('detects python', () => {
    const diff = `diff --git a/src/app.py b/src/app.py
index 123..456 100644
--- a/src/app.py
+++ b/src/app.py`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('detects rust', () => {
    const diff = `diff --git a/src/app.rs b/src/app.rs
index 123..456 100644
--- a/src/app.rs
+++ b/src/app.rs`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('detects mixed languages', () => {
    const diff = `diff --git a/src/app.ts b/src/app.ts
index 123..456 100644
--- a/src/app.ts
+++ b/src/app.ts
diff --git a/src/script.py b/src/script.py
index 123..456 100644
--- a/src/script.py
+++ b/src/script.py`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('defaults to javascript if no recognized files', () => {
    const diff = `diff --git a/src/README.md b/src/README.md
index 123..456 100644
--- a/src/README.md
+++ b/src/README.md`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('handles empty diff', () => {
    expect(detectLanguageFromDiff('')).toBe('javascript');
  });

  it('detects primary language when multiple files of same type', () => {
      const diff = `diff --git a/src/1.ts b/src/1.ts
index 123..456 100644
--- a/src/1.ts
+++ b/src/1.ts
diff --git a/src/2.ts b/src/2.ts
index 123..456 100644
--- a/src/2.ts
+++ b/src/2.ts`;
      expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });
});
