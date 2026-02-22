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

  // Track found languages. If we find more than one type, we can return 'mixed' immediately.
  // Optimization: Single pass regex + early exit avoids processing large diffs fully when result is 'mixed'.
  const foundLanguages = new Set<SupportedLanguage>();

  while ((match = filePathRegex.exec(diff)) !== null) {
    const path = match[1];
    if (!path) continue;

    const lastDotIndex = path.lastIndexOf('.');
    if (lastDotIndex === -1) continue;

    // Optimization: Extract extension and lowercase only that part instead of full path
    const ext = path.slice(lastDotIndex).toLowerCase();
    let detected: SupportedLanguage | null = null;

    if (ext === '.ts' || ext === '.tsx') {
      detected = 'typescript';
    } else if (ext === '.js' || ext === '.jsx' || ext === '.mjs' || ext === '.cjs') {
      detected = 'javascript';
    } else if (ext === '.py' || ext === '.pyw') {
      detected = 'python';
    } else if (ext === '.rs') {
      detected = 'rust';
    }

    if (detected) {
      foundLanguages.add(detected);
      if (foundLanguages.size > 1) {
        return 'mixed';
      }
    }
  }

  if (foundLanguages.size === 0) {
    return 'javascript'; // Default fallback
  }

  // If size is 1, return that language
  return foundLanguages.values().next().value as SupportedLanguage;
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
