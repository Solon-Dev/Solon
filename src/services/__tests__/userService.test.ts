
import UserService from '../userService';

describe('UserService', () => {
  it('should generate a valid UUID when creating a user', async () => {
    const service = new UserService();
    const user = await service.createUser({
      email: 'test@example.com',
      name: 'Test User',
      age: 25
    });

    expect(user.id).toBeDefined();
    // Verify it matches UUID v4 format
    expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    console.log('Generated ID:', user.id);
  });
});
