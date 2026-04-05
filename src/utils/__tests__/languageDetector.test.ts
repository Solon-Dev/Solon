import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  it('detects typescript', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
--- a/src/index.ts
+++ b/src/index.ts
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('detects javascript', () => {
    const diff = `
diff --git a/index.js b/index.js
--- a/index.js
+++ b/index.js
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('detects python', () => {
    const diff = `
diff --git a/script.py b/script.py
--- a/script.py
+++ b/script.py
`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('detects rust', () => {
    const diff = `
diff --git a/main.rs b/main.rs
--- a/main.rs
+++ b/main.rs
`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('returns mixed for mixed languages', () => {
    const diff = `
diff --git a/index.ts b/index.ts
--- a/index.ts
+++ b/index.ts
@@ -1 +1 @@
+ console.log('hi');

diff --git a/script.py b/script.py
--- a/script.py
+++ b/script.py
@@ -1 +1 @@
+ print('hi')
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('returns javascript (default) for unknown/empty', () => {
    const diff = `
diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('handles multiple files of same language', () => {
    const diff = `
diff --git a/file1.ts b/file1.ts
...
diff --git a/file2.ts b/file2.ts
...
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

    it('returns mixed even if one count is much higher', () => {
    // 10 TS files and 1 JS file should be mixed
    let diff = '';
    for(let i=0; i<10; i++) {
        diff += `diff --git a/file${i}.ts b/file${i}.ts\n`;
    }
    diff += `diff --git a/other.js b/other.js\n`;

    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });
});
