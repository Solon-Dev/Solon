<<<<<<< HEAD
/**
 * Calculates the average of an array of numbers.
 * @param numbers - An array of numbers.
 * @returns The average of the numbers.
 */
=======
// src/utils/math.ts
>>>>>>> c5affa17fb9b8803347e59ae9a3d51185b74db3b
export function calculateAverage(numbers: number[]): number {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}
<<<<<<< HEAD

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
=======
>>>>>>> c5affa17fb9b8803347e59ae9a3d51185b74db3b
