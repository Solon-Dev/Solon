import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  it('should detect TypeScript from .ts and .tsx files', () => {
    const diff = `
diff --git a/src/components/Button.tsx b/src/components/Button.tsx
...
diff --git a/src/utils/helper.ts b/src/utils/helper.ts
...
    `;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should detect JavaScript from .js files', () => {
    const diff = `
diff --git a/src/index.js b/src/index.js
...
    `;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect Python from .py files', () => {
    const diff = `
diff --git a/app.py b/app.py
...
    `;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('should detect Rust from .rs files', () => {
    const diff = `
diff --git a/src/main.rs b/src/main.rs
...
    `;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('should return "mixed" for multiple languages', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
...
diff --git a/script.py b/script.py
...
    `;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should default to "javascript" if no recognized files found', () => {
    const diff = `
diff --git a/README.md b/README.md
...
    `;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should handle different diff header formats', () => {
    const diff = `
--- a/old/path.ts
+++ b/new/path.ts
    `;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });
});
