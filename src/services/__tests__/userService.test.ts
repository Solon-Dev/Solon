/** @jest-environment node */
import UserService from '../userService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should generate a secure UUID for the user ID', async () => {
    const input = {
      email: 'test@example.com',
      name: 'Test User',
      age: 25,
    };

    const user = await userService.createUser(input);

    // Regex for UUID v4
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(user.id).toMatch(uuidRegex);
    expect(user.id).not.toMatch(/^0\./); // Should not look like Math.random()
  });
});
