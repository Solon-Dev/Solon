
import { detectLanguageFromDiff } from './languageDetector';

describe('detectLanguageFromDiff', () => {
  test('detects TypeScript', () => {
    const diff = `
diff --git a/src/app.ts b/src/app.ts
index 83a040e..d009020 100644
--- a/src/app.ts
+++ b/src/app.ts
@@ -1,4 +1,4 @@
-const x: number = 1;
+const x: number = 2;
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  test('detects JavaScript', () => {
    const diff = `
diff --git a/index.js b/index.js
index 83a040e..d009020 100644
--- a/index.js
+++ b/index.js
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  test('detects Python', () => {
    const diff = `
diff --git a/script.py b/script.py
index 83a040e..d009020 100644
--- a/script.py
+++ b/script.py
`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  test('detects Rust', () => {
    const diff = `
diff --git a/main.rs b/main.rs
index 83a040e..d009020 100644
--- a/main.rs
+++ b/main.rs
`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  test('detects Mixed', () => {
    const diff = `
diff --git a/src/app.ts b/src/app.ts
--- a/src/app.ts
+++ b/src/app.ts
diff --git a/script.py b/script.py
--- a/script.py
+++ b/script.py
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  test('defaults to JavaScript for unknown/empty', () => {
    expect(detectLanguageFromDiff('')).toBe('javascript');
    expect(detectLanguageFromDiff('some random text')).toBe('javascript');
  });

  test('handles case insensitivity', () => {
    const diff = `
diff --git a/src/App.TS b/src/App.TS
--- a/src/App.TS
+++ b/src/App.TS
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  test('performance on large diff', () => {
    // Generate a large diff
    let diff = '';
    for (let i = 0; i < 10000; i++) {
      diff += `diff --git a/file${i}.ts b/file${i}.ts\n`;
      diff += `--- a/file${i}.ts\n`;
      diff += `+++ b/file${i}.ts\n`;
    }

    const start = process.hrtime();
    const result = detectLanguageFromDiff(diff);
    const end = process.hrtime(start);
    const duration = end[0] * 1000 + end[1] / 1e6;

    console.log(`Large diff detection took ${duration.toFixed(2)}ms`);
    expect(result).toBe('typescript');
  });
});
