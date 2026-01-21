/**
 * Language detection and configuration for Solon AI
 * Supports JavaScript/TypeScript, Python, and Rust
 */

export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'rust' | 'mixed';

export interface LanguageConfig {
  language: SupportedLanguage;
  testFramework: string;
  testFileExtension: string;
  syntaxHighlight: string;
  expertise: string;
}

/**
 * Detects the primary programming language from a git diff
 */
export function detectLanguageFromDiff(diff: string): SupportedLanguage {
  // Extract file paths from diff headers (e.g., "diff --git a/path/to/file.ext b/path/to/file.ext")
  const filePathRegex = /^(?:diff --git|---|\+\+\+) [ab]\/(.+)$/gm;
  let match;

  // Count files by extension
  const languageCounts = {
    typescript: 0,
    javascript: 0,
    python: 0,
    rust: 0,
  };

  let languagesFound = 0;

  while ((match = filePathRegex.exec(diff)) !== null) {
    if (match[1]) {
      const lowerPath = match[1].toLowerCase();
      let detected: keyof typeof languageCounts | null = null;

      if (lowerPath.endsWith('.ts') || lowerPath.endsWith('.tsx')) {
        detected = 'typescript';
      } else if (lowerPath.endsWith('.js') || lowerPath.endsWith('.jsx') || lowerPath.endsWith('.mjs') || lowerPath.endsWith('.cjs')) {
        detected = 'javascript';
      } else if (lowerPath.endsWith('.py') || lowerPath.endsWith('.pyw')) {
        detected = 'python';
      } else if (lowerPath.endsWith('.rs')) {
        detected = 'rust';
      }

      if (detected) {
        if (languageCounts[detected] === 0) {
          languagesFound++;
          // Optimization: If we have already found more than one language, we can return 'mixed' immediately
          // without parsing the rest of the diff.
          if (languagesFound > 1) {
            return 'mixed';
          }
        }
        languageCounts[detected]++;
      }
    }
  }

  // Determine primary language (highest count)
  const entries = Object.entries(languageCounts) as [SupportedLanguage, number][];
  const nonZeroLanguages = entries.filter(([, count]) => count > 0);

  if (nonZeroLanguages.length === 0) {
    return 'javascript'; // Default fallback
  }

  // Double check, though early exit handles most cases
  if (nonZeroLanguages.length > 1) {
    return 'mixed';
  }

  // Return the language with the highest count
  // Since we exit early on mixed, if we are here, there is only 1 non-zero language.
  return nonZeroLanguages[0][0];
}

/**
 * Get language-specific configuration
 */
export function getLanguageConfig(language: SupportedLanguage): LanguageConfig {
  const configs: Record<SupportedLanguage, LanguageConfig> = {
    javascript: {
      language: 'javascript',
      testFramework: 'Jest',
      testFileExtension: '.test.js',
      syntaxHighlight: 'javascript',
      expertise: 'JavaScript',
    },
    typescript: {
      language: 'typescript',
      testFramework: 'Jest',
      testFileExtension: '.test.ts',
      syntaxHighlight: 'typescript',
      expertise: 'TypeScript',
    },
    python: {
      language: 'python',
      testFramework: 'pytest',
      testFileExtension: '_test.py',
      syntaxHighlight: 'python',
      expertise: 'Python',
    },
    rust: {
      language: 'rust',
      testFramework: 'Rust built-in test framework',
      testFileExtension: '.rs',
      syntaxHighlight: 'rust',
      expertise: 'Rust',
    },
    mixed: {
      language: 'mixed',
      testFramework: 'appropriate test framework for each file',
      testFileExtension: 'varies',
      syntaxHighlight: 'typescript', // Default to typescript for mixed
      expertise: 'multiple programming languages including JavaScript, TypeScript, Python, and Rust',
    },
  };

  return configs[language];
}

/**
 * Get language-specific best practices and considerations
 */
export function getLanguageBestPractices(language: SupportedLanguage): string {
  const practices: Record<SupportedLanguage, string> = {
    javascript: `
- Proper error handling and promise rejection
- Asynchronous code patterns (async/await, promises)
- Memory leaks and closure issues
- Type coercion pitfalls
- Event loop blocking`,
    typescript: `
- Type safety and proper type annotations
- Avoiding 'any' types when possible
- Proper use of generics and type guards
- Async/await and promise typing
- Interface vs type alias usage`,
    python: `
- PEP 8 style guidelines
- Proper exception handling
- Resource management (context managers)
- Type hints (PEP 484)
- List comprehension vs loops
- Mutable default arguments
- Global interpreter lock (GIL) implications`,
    rust: `
- Ownership and borrowing rules
- Lifetime annotations
- Error handling (Result and Option types)
- Unsafe code blocks and their justification
- Memory safety without garbage collection
- Concurrency patterns (Send, Sync traits)
- Zero-cost abstractions
- Pattern matching completeness`,
    mixed: `
- Language-specific best practices for each file
- Consistency within each language domain
- Proper API boundaries between different languages
- Error handling across language boundaries`,
  };

  return practices[language];
}

/**
 * Get language-specific security considerations
 */
export function getLanguageSecurityConsiderations(language: SupportedLanguage): string {
  const security: Record<SupportedLanguage, string> = {
    javascript: `
- XSS vulnerabilities
- SQL/NoSQL injection
- Prototype pollution
- eval() and Function() usage
- RegEx DoS attacks`,
    typescript: `
- Type assertion bypassing security checks
- XSS vulnerabilities
- SQL/NoSQL injection
- Improper input validation
- Unsafe type casting`,
    python: `
- SQL injection (especially with raw queries)
- Command injection (subprocess, os.system)
- Pickle deserialization vulnerabilities
- Path traversal attacks
- YAML deserialization issues
- eval() and exec() usage`,
    rust: `
- Unsafe block usage and soundness
- Integer overflow in debug vs release mode
- FFI boundary safety
- Unvalidated user input in unsafe operations
- Timing attacks in cryptographic code`,
    mixed: `
- Language-specific security vulnerabilities for each file type
- Cross-language boundary validation
- Consistent security policies across different components`,
  };

  return security[language];
}
