
import UserService from '../userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  test('should verify password correctly', async () => {
    const password = 'securePassword123';
    await service.createUser({
      email: 'test@example.com',
      name: 'Test User',
      age: 25,
      password: password
    });

    // Should return true for correct password
    const isAuthenticated = await service.authenticateUser('test@example.com', password);
    expect(isAuthenticated).toBe(true);

    // Should return false for incorrect password
    const isNotAuthenticated = await service.authenticateUser('test@example.com', 'wrongPassword');
    expect(isNotAuthenticated).toBe(false);
  });

  test('should return false if user does not exist', async () => {
    const isAuthenticated = await service.authenticateUser('nonexistent@example.com', 'password');
    expect(isAuthenticated).toBe(false);
  });

  test('should return false if password is not provided', async () => {
      await service.createUser({
      email: 'test2@example.com',
      name: 'Test User 2',
      age: 25,
      password: 'password'
    });

    // @ts-ignore
    const isAuthenticated = await service.authenticateUser('test2@example.com');
    expect(isAuthenticated).toBe(false);
  });
});
