import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  it('should detect typescript', () => {
    const diff = `diff --git a/src/index.ts b/src/index.ts
index 1234567..89abcdef 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,5 +1,5 @@`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should detect javascript', () => {
    const diff = `diff --git a/src/app.js b/src/app.js
index 1234567..89abcdef 100644
--- a/src/app.js
+++ b/src/app.js`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect python', () => {
    const diff = `diff --git a/script.py b/script.py
index 1234567..89abcdef 100644`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('should detect rust', () => {
    const diff = `diff --git a/src/main.rs b/src/main.rs
index 1234567..89abcdef 100644`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('should detect mixed language', () => {
    const diff = `diff --git a/src/index.ts b/src/index.ts
index 1234567..89abcdef 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,5 +1,5 @@
diff --git a/script.py b/script.py
index 1234567..89abcdef 100644`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should default to javascript when no supported files found', () => {
    const diff = `diff --git a/README.md b/README.md
index 1234567..89abcdef 100644`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should default to javascript on empty diff', () => {
    expect(detectLanguageFromDiff('')).toBe('javascript');
  });
});
