// src/services/userService.test.ts
import UserService from './userService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('authenticateUser', () => {
    it('should return false for non-existent user', () => {
      const result = userService.authenticateUser('nonexistent@example.com');
      expect(result).toBe(false);
    });

    it('should return false for empty email', () => {
      const result = userService.authenticateUser('');
      expect(result).toBe(false);
    });

    it('should return false for malformed email', () => {
      const result = userService.authenticateUser('invalid@email');
      expect(result).toBe(false);
    });

    it('should return true for valid user', () => {
      userService.createUser('test@example.com', 'password');
      const result = userService.authenticateUser('test@example.com');
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', () => {
      userService.createUser('test@example.com', 'password');
      const result = userService.authenticateUser('test@example.com', 'wrongpassword');
      expect(result).toBe(false);
    });
  });
});
