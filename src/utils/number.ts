
/**
 * Clamps a number within the inclusive lower and upper bounds.
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) { return min; }
  if (value > max) { return max; }
  return value;
}
// Test change to trigger Solon review

/**
 * Test function to verify Solon AI review system
 */
export function multiply(a: number, b: number): number {
  return a * b;
}
