import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  it('should detect typescript', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
index 123..456 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,1 +1,1 @@
+console.log('hello');
    `;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should detect javascript', () => {
    const diff = `
diff --git a/src/index.js b/src/index.js
index 123..456 100644
--- a/src/index.js
+++ b/src/index.js
@@ -1,1 +1,1 @@
+console.log('hello');
    `;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should detect python', () => {
    const diff = `
diff --git a/src/main.py b/src/main.py
index 123..456 100644
--- a/src/main.py
+++ b/src/main.py
@@ -1,1 +1,1 @@
+print('hello')
    `;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('should detect rust', () => {
    const diff = `
diff --git a/src/main.rs b/src/main.rs
index 123..456 100644
--- a/src/main.rs
+++ b/src/main.rs
@@ -1,1 +1,1 @@
+println!("hello");
    `;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('should detect mixed languages', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
--- a/src/index.ts
+++ b/src/index.ts
@@ -1 +1 @@
+code
diff --git a/src/script.py b/src/script.py
--- a/src/script.py
+++ b/src/script.py
@@ -1 +1 @@
+code
    `;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should fallback to javascript for unknown or empty', () => {
    const diff = '';
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should prioritize single language even if multiple files of same type', () => {
     const diff = `
diff --git a/src/index.ts b/src/index.ts
--- a/src/index.ts
+++ b/src/index.ts
diff --git a/src/utils.ts b/src/utils.ts
--- a/src/utils.ts
+++ b/src/utils.ts
     `;
     expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });
});
