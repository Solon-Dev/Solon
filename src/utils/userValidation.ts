/**
 * User validation utilities for authentication system
 */

interface User {
  email: string;
  age: number;
  username: string;
}

/**
 * Validates user registration data
 * Returns true if valid, false otherwise
 */
export function validateUser(user: User): boolean {
  // Check email format
  if (!user.email.includes('@')) {
    return false;
  }
  
  // Check age requirement
  if (user.age < 18) {
    return false;
  }
  
  // Check username length
  if (user.username.length < 3) {
    return false;
  }
  
  return true;
}

/**
 * Sanitizes user input for database storage
 */
export function sanitizeInput(input: string): string {
  return input.trim();
}

/**
 * Calculates user account age in days
 */
export function getAccountAgeDays(createdAt: Date): number {
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Formats user display name
 */
export function formatDisplayName(firstName: string, lastName: string): string {
  return firstName + ' ' + lastName;
}
