import { detectLanguageFromDiff } from './languageDetector';

describe('detectLanguageFromDiff', () => {
  it('should detect language from modified files', () => {
    const diff = `diff --git a/src/index.ts b/src/index.ts
index 1234567..89abcdef 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,1 +1,1 @@
-console.log("hello");
+console.log("hello world");`;

    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('should detect language from new files', () => {
    const diff = `diff --git a/new.rs b/new.rs
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/new.rs
@@ -0,0 +1 @@
+fn main() {}`;

    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('should ignore deleted files', () => {
    // If we only have deleted python files, it should default to javascript (or return something else if we decide)
    // The current implementation defaults to 'javascript' if no files are found.
    const diff = `diff --git a/deleted.py b/deleted.py
deleted file mode 100644
index 1234567..0000000
--- a/deleted.py
+++ /dev/null
@@ -1 +0,0 @@
-print("Delete me")`;

    // With optimization, deleted files are ignored. So count is 0. Defaults to 'javascript'.
    // Before optimization, it would count as python.
    // Ideally we probably want to know what was deleted, but for "expert review" of *new* code,
    // we don't need a Python expert to say "Yep, that file is gone".
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('should handle mixed languages', () => {
    const diff = `diff --git a/src/index.ts b/src/index.ts
index ...
--- a/src/index.ts
+++ b/src/index.ts
@@ ...
+const x: number = 1;
diff --git a/script.py b/script.py
index ...
--- a/script.py
+++ b/script.py
@@ ...
+print("hello")`;

    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('should handle renames correctly', () => {
     // Rename .js to .ts
     const diff = `diff --git a/old.js b/new.ts
similarity index 100%
rename from old.js
rename to new.ts
index ...
--- a/old.js
+++ b/new.ts
@@ ...`;

     expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });
});
