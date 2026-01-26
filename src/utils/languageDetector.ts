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

// Map extensions to languages for O(1) lookup
const EXTENSION_MAP: Record<string, SupportedLanguage> = {
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.py': 'python',
  '.pyw': 'python',
  '.rs': 'rust',
};

/**
 * Detects the primary programming language from a git diff
 */
export function detectLanguageFromDiff(diff: string): SupportedLanguage {
  // Extract file extension directly from diff headers
  // Optimization: Capture ONLY the extension at the end of the line.
  // This avoids capturing and allocating the full path string (which can be very long).
  // Regex explanation:
  // ^(?:diff --git|---|\+\+\+) : Start of line, match diff header prefixes
  // [ab]\/                     : Match a/ or b/ (source/destination)
  // .*?                        : Non-greedy match of the path
  // (\.[a-zA-Z0-9]+)$          : Capture the extension (dot + alphanumeric) at the end of line
  const filePathRegex = /^(?:diff --git|---|\+\+\+) [ab]\/.*?(\.[a-zA-Z0-9]+)$/gm;
  let match;

  // Track found languages. If we find more than one type, we can return 'mixed' immediately.
  // Optimization: Single pass regex + early exit avoids processing large diffs fully when result is 'mixed'.
  const foundLanguages = new Set<SupportedLanguage>();

  while ((match = filePathRegex.exec(diff)) !== null) {
    // match[1] is now just the extension (e.g. ".ts")
    // We still lower case it to be safe, though most are lowercase.
    const ext = match[1].toLowerCase();
    const detected = EXTENSION_MAP[ext];

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
  return foundLanguages.values().next().value;
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
