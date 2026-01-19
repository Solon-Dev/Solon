import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff', () => {
  test('detects javascript', () => {
    const diff = `
diff --git a/src/index.js b/src/index.js
index 1234567..890abcd 100644
--- a/src/index.js
+++ b/src/index.js
@@ -1,5 +1,5 @@
-console.log("Hello");
+console.log("Hello World");
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  test('detects typescript', () => {
    const diff = `
diff --git a/src/App.tsx b/src/App.tsx
index 1234567..890abcd 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -1,5 +1,5 @@
-const App: React.FC = () => null;
+const App: React.FC = () => <div>Hello</div>;
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  test('detects python', () => {
    const diff = `
diff --git a/script.py b/script.py
index 1234567..890abcd 100644
--- a/script.py
+++ b/script.py
@@ -1,2 +1,2 @@
-print("Hello")
+print("Hello World")
`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  test('detects rust', () => {
    const diff = `
diff --git a/main.rs b/main.rs
index 1234567..890abcd 100644
--- a/main.rs
+++ b/main.rs
@@ -1,3 +1,3 @@
 fn main() {
-    println!("Hello");
+    println!("Hello World");
 }
`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  test('detects mixed languages', () => {
    const diff = `
diff --git a/src/index.ts b/src/index.ts
--- a/src/index.ts
+++ b/src/index.ts
@@ -1 +1 @@
-x
+y
diff --git a/script.py b/script.py
--- a/script.py
+++ b/script.py
@@ -1 +1 @@
-a
+b
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  test('defaults to javascript if no supported extensions found', () => {
    const diff = `
diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -1 +1 @@
-Title
+New Title
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  test('handles mixed extensions within same language family (JS)', () => {
    const diff = `
diff --git a/file1.js b/file1.js
--- a/file1.js
+++ b/file1.js
@@ -1 +1 @@
-a
+b
diff --git a/file2.jsx b/file2.jsx
--- a/file2.jsx
+++ b/file2.jsx
@@ -1 +1 @@
-c
+d
`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  test('handles mixed extensions within same language family (TS)', () => {
    const diff = `
diff --git a/file1.ts b/file1.ts
--- a/file1.ts
+++ b/file1.ts
@@ -1 +1 @@
-a
+b
diff --git a/file2.tsx b/file2.tsx
--- a/file2.tsx
+++ b/file2.tsx
@@ -1 +1 @@
-c
+d
`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  test('returns mixed if multiple languages present even if one is dominant', () => {
     // Even if there are 2 TS files and 1 Python file, it should return 'mixed'
     // strictly speaking based on current implementation:
     // "if (nonZeroLanguages.length > 1) { return 'mixed'; }"
     const diff = `
diff --git a/file1.ts b/file1.ts
--- a/file1.ts
+++ b/file1.ts
@@ -1 +1 @@
-a
+b
diff --git a/file2.ts b/file2.ts
--- a/file2.ts
+++ b/file2.ts
@@ -1 +1 @@
-a
+b
diff --git a/script.py b/script.py
--- a/script.py
+++ b/script.py
@@ -1 +1 @@
-a
+b
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  test('handles empty diff', () => {
      expect(detectLanguageFromDiff('')).toBe('javascript');
  });
});
