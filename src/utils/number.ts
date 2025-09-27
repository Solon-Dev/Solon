
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

/**
 * Calculates the average of an array of numbers
 * @param numbers Array of numbers to average
 * @returns The arithmetic mean
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error("Cannot calculate average of empty array");
  }
  
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}
