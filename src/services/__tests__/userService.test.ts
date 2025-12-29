import UserService from '../userService';
import { randomUUID } from 'crypto';

// Polyfill randomUUID if it's not available
if (!global.crypto.randomUUID) {
  Object.defineProperty(global.crypto, 'randomUUID', {
    value: randomUUID,
    writable: true,
  });
}

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('authenticateUser', () => {
    it('should authenticate a user with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'securePassword123';

      await userService.createUser({
        email,
        name: 'Test User',
        age: 25,
        password,
      });

      const isAuthenticated = userService.authenticateUser(email, password);
      expect(isAuthenticated).toBe(true);
    });

    it('should reject a user with incorrect password', async () => {
      const email = 'test@example.com';
      const password = 'securePassword123';
      const wrongPassword = 'wrongPassword';

      await userService.createUser({
        email,
        name: 'Test User',
        age: 25,
        password,
      });

      const isAuthenticated = userService.authenticateUser(email, wrongPassword);
      expect(isAuthenticated).toBe(false);
    });

    it('should return false for non-existent user', () => {
      const isAuthenticated = userService.authenticateUser('nonexistent@example.com', 'somePassword');
      expect(isAuthenticated).toBe(false);
    });

    it('should return false if password is not provided', async () => {
        const email = 'test@example.com';
        const password = 'securePassword123';

        await userService.createUser({
          email,
          name: 'Test User',
          age: 25,
          password,
        });

        const isAuthenticated = userService.authenticateUser(email);
        expect(isAuthenticated).toBe(false);
      });
  });
});
