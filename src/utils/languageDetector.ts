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

  // Track detected languages using booleans for performance (avoids allocating arrays)
  let hasTypescript = false;
  let hasJavascript = false;
  let hasPython = false;
  let hasRust = false;
  let languagesFound = 0;

  let match;
  while ((match = filePathRegex.exec(diff)) !== null) {
    if (!match[1]) continue;
    const lowerPath = match[1].toLowerCase();

    if (lowerPath.endsWith('.ts') || lowerPath.endsWith('.tsx')) {
      if (!hasTypescript) {
        hasTypescript = true;
        languagesFound++;
      }
    } else if (lowerPath.endsWith('.js') || lowerPath.endsWith('.jsx') || lowerPath.endsWith('.mjs') || lowerPath.endsWith('.cjs')) {
      if (!hasJavascript) {
        hasJavascript = true;
        languagesFound++;
      }
    } else if (lowerPath.endsWith('.py') || lowerPath.endsWith('.pyw')) {
      if (!hasPython) {
        hasPython = true;
        languagesFound++;
      }
    } else if (lowerPath.endsWith('.rs')) {
      if (!hasRust) {
        hasRust = true;
        languagesFound++;
      }
    }

    // Performance optimization: Early exit if mixed content is detected
    if (languagesFound > 1) {
      return 'mixed';
    }
  }

  if (hasTypescript) return 'typescript';
  if (hasJavascript) return 'javascript';
  if (hasPython) return 'python';
  if (hasRust) return 'rust';

  return 'javascript'; // Default fallback
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
