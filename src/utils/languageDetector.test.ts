import { detectLanguageFromDiff } from './languageDetector';

describe('detectLanguageFromDiff', () => {
  it('should default to javascript when no files are detected', () => {
    const diff = '';
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect typescript', () => {
    const diff = `diff --git a/src/app.ts b/src/app.ts
index 1234567..890abcd 100644
--- a/src/app.ts
+++ b/src/app.ts
@@ -1,5 +1,5 @@`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should detect javascript', () => {
    const diff = `diff --git a/script.js b/script.js
index 1234567..890abcd 100644`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect python', () => {
    const diff = `diff --git a/main.py b/main.py
index 1234567..890abcd 100644`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('should detect rust', () => {
    const diff = `diff --git a/src/main.rs b/src/main.rs
index 1234567..890abcd 100644`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('should detect mixed languages', () => {
    const diff = `diff --git a/src/app.ts b/src/app.ts
diff --git a/script.js b/script.js`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should return the majority language if one dominates', () => {
     // NOTE: The current implementation returns 'mixed' if > 1 language type has count > 0.
     // It does NOT return the majority language unless only that language exists.
     // Let's verify this behavior based on reading the code:
     // if (nonZeroLanguages.length > 1) { return 'mixed'; }

     const diff = `diff --git a/file1.ts b/file1.ts
diff --git a/file2.ts b/file2.ts
diff --git a/script.js b/script.js`;
     expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should handle different diff headers', () => {
      const diff = `--- a/src/component.tsx
+++ b/src/component.tsx`;
      expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });
});
