// src/utils/math.ts
export function calculateAverage(numbers: number[]): number {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

/**
 * Calculates the product of all numbers in an array
 * @param numbers - Array of numbers to multiply
 * @returns The product of all numbers
 */
export function calculateProduct(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc * num, 1);
}

/**
 * Finds the maximum value in an array
 * @param numbers - Array of numbers
 * @returns The maximum value
 */
export function findMax(numbers: number[]): number {
  return Math.max(...numbers);
}
