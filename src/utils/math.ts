/**
 * Calculates the average of an array of numbers.
 * @param numbers - An array of numbers.
 * @returns The average of the numbers.
 */
export function calculateAverage(numbers: number[]): number {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

/**
 * Validates the format of an email address using a simple regex.
 * @param email The email string to validate.
 * @returns True if the email format is valid, otherwise false.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length === 0) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
