
import UserService from '../userService';

/** @jest-environment node */

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  test('createUser generates a valid UUID', async () => {
    const user = await service.createUser({
      email: 'test@example.com',
      name: 'Test User',
      age: 25,
    });

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    console.log('Generated ID:', user.id);

    // UUID v4 regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(user.id).toMatch(uuidRegex);
  });
});
