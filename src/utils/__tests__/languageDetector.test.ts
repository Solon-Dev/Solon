
import { detectLanguageFromDiff } from '../languageDetector';

describe('detectLanguageFromDiff Performance & Correctness', () => {
  const generateDiff = (fileType: string, count: number) => {
    let diff = '';
    for (let i = 0; i < count; i++) {
      diff += `diff --git a/file${i}.${fileType} b/file${i}.${fileType}\n`;
      diff += `--- a/file${i}.${fileType}\n`;
      diff += `+++ b/file${i}.${fileType}\n`;
      diff += `@@ -1,1 +1,1 @@\n`;
      diff += `+ content\n`;
    }
    return diff;
  };

  test('correctly identifies single language (typescript)', () => {
    const diff = generateDiff('ts', 5);
    expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  test('correctly identifies mixed languages', () => {
    const diff = generateDiff('ts', 2) + generateDiff('py', 2);
    expect(detectLanguageFromDiff(diff)).toBe('mixed');
  });

  test('correctly identifies majority language if not mixed (impossible with current logic but valid check)', () => {
      // Current logic says >1 types = mixed. So majority check only applies if we have multiple files of ONE type vs 0 of others.
      // But let's verify consistent behavior.
      const diff = generateDiff('ts', 5);
      expect(detectLanguageFromDiff(diff)).toBe('typescript');
  });

  test('handles massive mixed diffs efficiently', () => {
    // 10000 lines of TS, then 1 line of Python
    // Current implementation will parse all 10000 lines before seeing python.
    // Optimized should see TS then Python and exit.

    const tsPart = generateDiff('ts', 5000);
    const pyPart = generateDiff('py', 1);
    const diff = tsPart + pyPart;

    const start = performance.now();
    const result = detectLanguageFromDiff(diff);
    const end = performance.now();

    expect(result).toBe('mixed');
    console.log(`Mixed detection took: ${end - start}ms`);
  });

   test('handles massive single language diffs', () => {
    const diff = generateDiff('ts', 10000);

    const start = performance.now();
    const result = detectLanguageFromDiff(diff);
    const end = performance.now();

    expect(result).toBe('typescript');
    console.log(`Single language detection took: ${end - start}ms`);
  });

  test('handles early mixed diffs efficiently', () => {
    // 1 line of Python, then 5000 lines of TS
    // Optimized should see Python then TS and exit.

    const pyPart = generateDiff('py', 1);
    const tsPart = generateDiff('ts', 5000);
    const diff = pyPart + tsPart;

    const start = performance.now();
    const result = detectLanguageFromDiff(diff);
    const end = performance.now();

    expect(result).toBe('mixed');
    console.log(`Early Mixed detection took: ${end - start}ms`);
  });
});
