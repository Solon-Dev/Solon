
import { detectLanguageFromDiff, SupportedLanguage } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  it('should detect TypeScript', () => {
    const diff = `
diff --git a/src/test.ts b/src/test.ts
index 123..456 100644
--- a/src/test.ts
+++ b/src/test.ts
@@ -1 +1 @@
-console.log('hello');
+console.log('world');
    `;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should detect JavaScript', () => {
    const diff = `diff --git a/script.js b/script.js`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect Python', () => {
    const diff = `diff --git a/app.py b/app.py`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('should detect Rust', () => {
    const diff = `diff --git a/main.rs b/main.rs`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('should return mixed for multiple languages', () => {
    const diff = `
diff --git a/src/test.ts b/src/test.ts
diff --git a/app.py b/app.py
    `;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should return mixed when multiple languages are present', () => {
    const diff = `
diff --git a/one.ts b/one.ts
diff --git a/two.ts b/two.ts
diff --git a/three.js b/three.js
    `;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should handle no matches', () => {
    const diff = `some random text`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript'); // Default
  });
});
