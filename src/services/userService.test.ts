import UserService from './userService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should generate a secure UUID for the user ID', async () => {
    const user = await userService.createUser({
      email: 'test@example.com',
      name: 'Test User',
      age: 25,
    });

    expect(user.id).toBeDefined();
    // Regex for UUID v4
    // Checking for standard UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(user.id).toMatch(uuidRegex);
    // Ensure it's not Math.random format (0.xxxx)
    expect(user.id).not.toMatch(/^0\.\d+$/);
  });
});
