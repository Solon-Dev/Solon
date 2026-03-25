/**
 * Preset Playbooks for Solon AI
 *
 * This file contains predefined playbooks for common coding standards:
 * - Accessibility (WCAG compliance)
 * - Security (vulnerability prevention)
 * - Best Practices (code quality)
 */

import { Playbook } from './types';

/**
 * ACCESSIBILITY PLAYBOOK
 * Enforces WCAG compliance and accessibility best practices
 */
export const ACCESSIBILITY_PLAYBOOK: Playbook = {
  name: 'Accessibility',
  description: 'WCAG compliance checks for accessible user interfaces',
  rules: [
    {
      id: 'a11y-interactive-labels',
      category: 'Interactive Elements',
      description: 'Interactive elements (buttons, links, inputs) must have accessible labels via aria-label, aria-labelledby, or visible text',
      severity: 'blocking',
      examples: {
        violation: '<button onClick={handleClick}><IconOnly /></button>',
        correct: '<button onClick={handleClick} aria-label="Submit form"><IconOnly /></button>'
      }
    },
    {
      id: 'a11y-img-alt',
      category: 'Images',
      description: 'Images must have alt text. Use empty string (alt="") for decorative images',
      severity: 'blocking',
      examples: {
        violation: '<img src="logo.png" />',
        correct: '<img src="logo.png" alt="Company Logo" /> or <img src="decorative.png" alt="" />'
      }
    },
    {
      id: 'a11y-color-contrast',
      category: 'Color Contrast',
      description: 'Color contrast must meet WCAG AA standards: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)',
      severity: 'warning',
      examples: {
        violation: 'color: #777 on white background (3:1 ratio)',
        correct: 'color: #595959 on white background (4.5:1 ratio)'
      }
    },
    {
      id: 'a11y-keyboard-nav',
      category: 'Keyboard Navigation',
      description: 'All interactive elements must be keyboard accessible. Custom interactive elements need tabIndex and keyboard event handlers',
      severity: 'blocking',
      examples: {
        violation: '<div onClick={handleClick}>Click me</div>',
        correct: '<button onClick={handleClick}>Click me</button> or <div role="button" tabIndex={0} onClick={handleClick} onKeyPress={handleKeyPress}>...</div>'
      }
    },
    {
      id: 'a11y-focus-indicators',
      category: 'Focus States',
      description: 'Interactive elements must have visible focus indicators. Do not set outline: none without providing alternative focus styles',
      severity: 'warning',
      examples: {
        violation: 'button:focus { outline: none; }',
        correct: 'button:focus { outline: 2px solid blue; } or button:focus { box-shadow: 0 0 0 3px rgba(0,0,255,0.5); }'
      }
    },
    {
      id: 'a11y-semantic-html',
      category: 'Semantic HTML',
      description: 'Use semantic HTML elements (nav, main, article, section, header, footer) instead of generic divs for better screen reader navigation',
      severity: 'info',
      examples: {
        violation: '<div className="navigation">...</div>',
        correct: '<nav>...</nav>'
      }
    },
    {
      id: 'a11y-form-labels',
      category: 'Forms',
      description: 'Form inputs must have associated <label> elements or aria-label attributes',
      severity: 'blocking',
      examples: {
        violation: '<input type="text" />',
        correct: '<label htmlFor="name">Name:</label><input id="name" type="text" /> or <input type="text" aria-label="Name" />'
      }
    }
  ]
};

/**
 * SECURITY PLAYBOOK
 * Detects common security vulnerabilities and unsafe patterns
 */
export const SECURITY_PLAYBOOK: Playbook = {
  name: 'Security',
  description: 'Common vulnerability detection and secure coding practices',
  rules: [
    {
      id: 'sec-no-secrets',
      category: 'Secrets Management',
      description: 'No hardcoded secrets, API keys, passwords, or tokens. Use environment variables or secret management services',
      severity: 'blocking',
      examples: {
        violation: 'const apiKey = "sk_live_abc123xyz";',
        correct: 'const apiKey = process.env.API_KEY;'
      }
    },
    {
      id: 'sec-input-validation',
      category: 'Input Validation',
      description: 'Validate and sanitize all user inputs before processing. Use validation libraries or schemas (zod, joi, etc.)',
      severity: 'blocking',
      examples: {
        violation: 'const result = await db.query(userInput);',
        correct: 'const validated = emailSchema.parse(userInput); const result = await db.query(validated);'
      }
    },
    {
      id: 'sec-sql-injection',
      category: 'SQL Injection',
      description: 'Use parameterized queries or ORMs. Never concatenate user input directly into SQL queries',
      severity: 'blocking',
      examples: {
        violation: 'db.query(`SELECT * FROM users WHERE id = ${userId}`)',
        correct: 'db.query("SELECT * FROM users WHERE id = ?", [userId])'
      }
    },
    {
      id: 'sec-xss-prevention',
      category: 'XSS Prevention',
      description: 'Escape user-generated content before rendering. Avoid dangerouslySetInnerHTML unless content is sanitized',
      severity: 'blocking',
      examples: {
        violation: '<div dangerouslySetInnerHTML={{__html: userComment}} />',
        correct: '<div>{userComment}</div> or use DOMPurify.sanitize() for trusted HTML'
      }
    },
    {
      id: 'sec-auth-checks',
      category: 'Authentication',
      description: 'Protected routes and API endpoints must verify authentication before processing requests',
      severity: 'blocking',
      examples: {
        violation: 'export async function DELETE(req) { await deleteUser(req.body.id); }',
        correct: 'export async function DELETE(req) { const user = await authenticateRequest(req); if (!user) return 401; ... }'
      }
    },
    {
      id: 'sec-https-only',
      category: 'Transport Security',
      description: 'Sensitive operations (authentication, payments) must use HTTPS. Check for secure cookie flags',
      severity: 'warning',
      examples: {
        violation: 'res.cookie("session", token);',
        correct: 'res.cookie("session", token, { secure: true, httpOnly: true, sameSite: "strict" });'
      }
    },
    {
      id: 'sec-session-management',
      category: 'Session Security',
      description: 'Implement secure session handling: expiration, secure storage, proper logout',
      severity: 'warning',
      examples: {
        violation: 'localStorage.setItem("token", authToken);',
        correct: 'Use httpOnly cookies or secure session storage with expiration'
      }
    },
    {
      id: 'sec-cors-config',
      category: 'CORS Configuration',
      description: 'CORS should be configured with specific origins, not wildcards (*) in production',
      severity: 'warning',
      examples: {
        violation: 'cors({ origin: "*" })',
        correct: 'cors({ origin: process.env.ALLOWED_ORIGINS.split(",") })'
      }
    }
  ]
};

/**
 * BEST PRACTICES PLAYBOOK
 * Code quality and maintainability standards
 */
export const BEST_PRACTICES_PLAYBOOK: Playbook = {
  name: 'Best Practices',
  description: 'Code quality standards and maintainability guidelines',
  rules: [
    {
      id: 'bp-single-responsibility',
      category: 'Design Principles',
      description: 'Functions and components should follow Single Responsibility Principle. Each should do one thing well',
      severity: 'info',
      examples: {
        violation: 'function fetchAndProcessAndSaveData() - doing three things',
        correct: 'Split into fetchData(), processData(), and saveData()'
      }
    },
    {
      id: 'bp-error-handling',
      category: 'Error Handling',
      description: 'All async operations must have proper error handling with try/catch or .catch()',
      severity: 'warning',
      examples: {
        violation: 'const data = await fetch(url);',
        correct: 'try { const data = await fetch(url); } catch (error) { handleError(error); }'
      }
    },
    {
      id: 'bp-no-magic-numbers',
      category: 'Code Clarity',
      description: 'Replace magic numbers with named constants for better readability',
      severity: 'info',
      examples: {
        violation: 'if (user.age < 18) return false;',
        correct: 'const MINIMUM_AGE = 18; if (user.age < MINIMUM_AGE) return false;'
      }
    },
    {
      id: 'bp-no-console-logs',
      category: 'Debugging Code',
      description: 'Remove console.log statements before merging. Use proper logging library for production logs',
      severity: 'warning',
      examples: {
        violation: 'console.log("User data:", userData);',
        correct: 'logger.info("User authenticated", { userId: user.id });'
      }
    },
    {
      id: 'bp-meaningful-names',
      category: 'Naming',
      description: 'Use descriptive, meaningful names for variables, functions, and components. Avoid abbreviations',
      severity: 'info',
      examples: {
        violation: 'const usr = getUsr(); const temp = calc(usr);',
        correct: 'const user = getUser(); const totalPrice = calculatePrice(user);'
      }
    },
    {
      id: 'bp-dry-principle',
      category: 'Code Duplication',
      description: 'Don\'t Repeat Yourself. Extract duplicate code into reusable functions or components',
      severity: 'info',
      examples: {
        violation: 'Multiple blocks of identical validation logic',
        correct: 'Extract into validateInput(input) function used everywhere'
      }
    },
    {
      id: 'bp-no-any-type',
      category: 'TypeScript',
      description: 'Avoid using "any" type. Use specific types, interfaces, or "unknown" if type is truly dynamic',
      severity: 'warning',
      examples: {
        violation: 'function process(data: any) { ... }',
        correct: 'function process(data: User | Product) { ... } or use generics'
      }
    },
    {
      id: 'bp-function-size',
      category: 'Code Organization',
      description: 'Functions should be concise (ideally under 50 lines). Large functions should be broken down',
      severity: 'info',
      examples: {
        violation: 'A 200-line function doing many things',
        correct: 'Break into smaller, focused functions with clear responsibilities'
      }
    }
  ]
};

/**
 * Collection of all available playbooks
 * Use this to look up playbooks by name
 */
export const ALL_PLAYBOOKS: Playbook[] = [
  ACCESSIBILITY_PLAYBOOK,
  SECURITY_PLAYBOOK,
  BEST_PRACTICES_PLAYBOOK
];

/**
 * Get playbooks by their names
 * @param names Array of playbook names (case-insensitive)
 * @returns Array of matching Playbook objects
 */
export function getPlaybooksByNames(names: string[]): Playbook[] {
  const normalizedNames = names.map(name => name.toLowerCase());
  return ALL_PLAYBOOKS.filter(playbook =>
    normalizedNames.includes(playbook.name.toLowerCase())
  );
}
