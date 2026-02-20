/**
 * String utility functions for text processing
 * This file intentionally contains various code issues to test Solon AI's review capabilities
 */

/**
 * Capitalizes the first letter of a string
 * @param str - The input string
 * @returns The string with first letter capitalized
 */
export function capitalizeFirst(str: string): string {
  // Missing null/undefined check - edge case
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Reverses a string
 * @param str - The string to reverse
 * @returns The reversed string
 */
export function reverseString(str: string): string {
  // Missing empty string check
  return str.split('').reverse().join('');
}

/**
 * Counts the number of words in a string
 * @param text - The input text
 * @returns Number of words
 */
export function countWords(text: string): number {
  // Doesn't handle multiple spaces, tabs, or newlines properly
  return text.split(' ').length;
}

/**
 * Truncates a string to a maximum length
 * @param str - The string to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  // No validation that maxLength is positive
  // No check if str is shorter than maxLength (wastes computation)
  return str.substring(0, maxLength) + '...';
}

/**
 * Extracts email domain from an email address
 * @param email - The email address
 * @returns The domain part
 */
export function extractEmailDomain(email: string): string {
  // No email format validation
  // Will throw error if @ is missing
  const parts = email.split('@');
  return parts[1];
}

/**
 * Checks if a string is a palindrome
 * @param str - The string to check
 * @returns True if palindrome, false otherwise
 */
export function isPalindrome(str: string): boolean {
  // Doesn't handle case sensitivity
  // Doesn't ignore spaces or special characters
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}

/**
 * Converts a string to camelCase
 * @param str - The input string (space or dash separated)
 * @returns camelCase version of the string
 */
export function toCamelCase(str: string): string {
  // Assumes input is always space-separated
  // Doesn't handle multiple delimiters (dashes, underscores)
  const words = str.split(' ');
  return words[0].toLowerCase() + words.slice(1).map(w =>
    w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  ).join('');
}

/**
 * Removes duplicate consecutive characters
 * @param str - The input string
 * @returns String with duplicates removed
 */
export function removeDuplicates(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    // Off-by-one error potential when accessing i+1
    if (str[i] !== str[i + 1]) {
      result += str[i];
    }
  }
  return result;
}
