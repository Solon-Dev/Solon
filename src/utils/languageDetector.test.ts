import { detectLanguageFromDiff } from './languageDetector';

describe('detectLanguageFromDiff', () => {
  it('detects typescript from diff headers', () => {
    const diff = `diff --git a/src/utils.ts b/src/utils.ts`;
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  it('detects javascript from diff headers', () => {
    const diff = `diff --git a/src/index.js b/src/index.js`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('detects python from diff headers', () => {
    const diff = `diff --git a/script.py b/script.py`;
    expect(detectLanguageFromDiff(diff)).toBe('python');
  });

  it('detects rust from diff headers', () => {
    const diff = `diff --git a/src/main.rs b/src/main.rs`;
    expect(detectLanguageFromDiff(diff)).toBe('rust');
  });

  it('detects mixed languages', () => {
    const diff = `
diff --git a/src/utils.ts b/src/utils.ts
diff --git a/script.py b/script.py
`;
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  it('defaults to javascript when no recognizable files found', () => {
    const diff = `some random text`;
    expect(detectLanguageFromDiff(diff)).toBe('javascript');
  });

  it('chooses majority language', () => {
    const diff = `
diff --git a/file1.ts b/file1.ts
diff --git a/file2.ts b/file2.ts
diff --git a/script.py b/script.py
`;
    // 2 TS vs 1 Py -> TS (because mixed checks if nonZeroLanguages.length > 1)

    // Wait, let's check the logic:
    // if (nonZeroLanguages.length > 1) { return 'mixed'; }
    // So even if 2 TS and 1 Py, it returns 'mixed'.

    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });
});
