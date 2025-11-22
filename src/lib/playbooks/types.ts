/**
 * Team Playbooks Type Definitions
 *
 * These types define the structure of playbooks used by Solon AI
 * to enforce team-specific coding standards during PR reviews.
 */

/**
 * Severity levels for playbook rules
 * - blocking: Must be fixed before merge
 * - warning: Should be addressed but not blocking
 * - info: Informational suggestions
 */
export type Severity = 'blocking' | 'warning' | 'info';

/**
 * A single rule within a playbook
 */
export interface PlaybookRule {
  /** Unique identifier for the rule */
  id: string;

  /** Category/topic of the rule (e.g., "Keyboard Navigation", "Input Validation") */
  category: string;

  /** Human-readable description of what the rule checks */
  description: string;

  /** How critical this rule is for the codebase */
  severity: Severity;

  /** Optional code examples showing violations and fixes */
  examples?: {
    /** Example of code that violates this rule */
    violation?: string;
    /** Example of correct code following this rule */
    correct?: string;
  };
}

/**
 * A playbook is a collection of related rules for a specific concern
 * (e.g., Accessibility, Security, Best Practices)
 */
export interface Playbook {
  /** Display name of the playbook */
  name: string;

  /** Brief description of what this playbook enforces */
  description: string;

  /** Collection of rules to check */
  rules: PlaybookRule[];
}

/**
 * Configuration for which playbooks are enabled
 */
export interface PlaybookConfig {
  /** List of playbook names to enable (e.g., ["accessibility", "security"]) */
  playbooks: string[];
}
