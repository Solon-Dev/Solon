
import UserService from '../userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  test('updateUserAge throws error for negative age', async () => {
    const user = await service.createUser({
      email: 'test@example.com',
      name: 'Test User',
      age: 25
    });

    await expect(service.updateUserAge(user.id, -5)).rejects.toThrow('Age must be a positive number');

    // Ensure age was not updated
    const updatedUser = service.getUserById(user.id);
    expect(updatedUser?.age).toBe(25);
  });

  test('updateUserAge throws error for zero age', async () => {
    const user = await service.createUser({
      email: 'test@example.com',
      name: 'Test User',
      age: 25
    });

    await expect(service.updateUserAge(user.id, 0)).rejects.toThrow('Age must be a positive number');

    const updatedUser = service.getUserById(user.id);
    expect(updatedUser?.age).toBe(25);
  });
});
