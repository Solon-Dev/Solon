
import { detectLanguageFromDiff, getLanguageConfig, getLanguageBestPractices, getLanguageSecurityConsiderations } from '../languageDetector';

describe('languageDetector', () => {
  describe('detectLanguageFromDiff', () => {
    it('should detect typescript from .ts file diff', () => {
      const diff = `diff --git a/src/app/api/analyze/route.ts b/src/app/api/analyze/route.ts
index e69de29..d95f3ad 100644
--- a/src/app/api/analyze/route.ts
+++ b/src/app/api/analyze/route.ts`;
      expect(detectLanguageFromDiff(diff)).toBe('typescript');
    });

    it('should detect javascript from .js file diff', () => {
      const diff = `diff --git a/src/utils/test.js b/src/utils/test.js
index e69de29..d95f3ad 100644
--- a/src/utils/test.js
+++ b/src/utils/test.js`;
      expect(detectLanguageFromDiff(diff)).toBe('javascript');
    });

    it('should detect python from .py file diff', () => {
      const diff = `diff --git a/scripts/test.py b/scripts/test.py
index e69de29..d95f3ad 100644
--- a/scripts/test.py
+++ b/scripts/test.py`;
      expect(detectLanguageFromDiff(diff)).toBe('python');
    });

    it('should detect rust from .rs file diff', () => {
        const diff = `diff --git a/src/main.rs b/src/main.rs
  index e69de29..d95f3ad 100644
  --- a/src/main.rs
  +++ b/src/main.rs`;
        expect(detectLanguageFromDiff(diff)).toBe('rust');
      });

    it('should default to javascript if no specific language is found', () => {
      const diff = 'no file paths here';
      expect(detectLanguageFromDiff(diff)).toBe('javascript');
    });

    it('should return mixed if multiple languages are present', () => {
        const diff = `diff --git a/src/main.rs b/src/main.rs
  index e69de29..d95f3ad 100644
  --- a/src/main.rs
  +++ b/src/main.rs
  diff --git a/src/utils/test.js b/src/utils/test.js
index e69de29..d95f3ad 100644
--- a/src/utils/test.js
+++ b/src/utils/test.js`;
        expect(detectLanguageFromDiff(diff)).toBe('mixed');
      });
  });

  describe('getLanguageConfig', () => {
    it('should return correct config for typescript', () => {
      const config = getLanguageConfig('typescript');
      expect(config.language).toBe('typescript');
      expect(config.testFramework).toBe('Jest');
    });
  });
});
