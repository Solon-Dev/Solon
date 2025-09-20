
/**
 * Truncates a string to a specified maximum length, appending an ellipsis.
 * @param text The string to truncate.
 * @param maxLength The maximum length of the string before truncation.
 * @returns The truncated string.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}
