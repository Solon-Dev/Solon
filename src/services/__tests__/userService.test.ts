
import UserService from '../userService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('authenticateUser', () => {
    test('should authenticate successfully with correct password', async () => {
      const password = 'securePassword123';
      await userService.createUser({
        email: 'test@example.com',
        name: 'Test User',
        age: 30,
        password: password
      });

      const result = await userService.authenticateUser('test@example.com', password);
      expect(result).toBe(true);
    });

    test('should fail authentication with incorrect password', async () => {
      await userService.createUser({
        email: 'test@example.com',
        name: 'Test User',
        age: 30,
        password: 'correctPassword'
      });

      const result = await userService.authenticateUser('test@example.com', 'wrongPassword');
      expect(result).toBe(false);
    });

    test('should fail authentication with missing password', async () => {
       await userService.createUser({
        email: 'test@example.com',
        name: 'Test User',
        age: 30,
        password: 'correctPassword'
      });

      const result = await userService.authenticateUser('test@example.com');
      expect(result).toBe(false);
    });

    test('should fail authentication for non-existent user', async () => {
      const result = await userService.authenticateUser('nonexistent@example.com', 'somePassword');
      expect(result).toBe(false);
    });
  });

  describe('createUser', () => {
      test('should throw error if password is missing', async () => {
          await expect(userService.createUser({
              email: 'nopass@example.com',
              name: 'No Pass',
              age: 20
          })).rejects.toThrow('Password is required');
      });
  });
});
