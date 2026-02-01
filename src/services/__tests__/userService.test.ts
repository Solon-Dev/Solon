import UserService from '../userService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('updateUserAge', () => {
    it('should throw an error when updating with a negative age', async () => {
      // First create a user
      const user = await userService.createUser({
        email: 'test@example.com',
        name: 'Test User',
        age: 25
      });

      // Try to update with negative age
      await expect(userService.updateUserAge(user.id, -5))
        .rejects
        .toThrow('Age must be a positive number');
    });

    it('should throw an error when updating with zero age', async () => {
        // First create a user
        const user = await userService.createUser({
          email: 'test@example.com',
          name: 'Test User',
          age: 25
        });

        // Try to update with zero age
        await expect(userService.updateUserAge(user.id, 0))
          .rejects
          .toThrow('Age must be a positive number');
      });

    it('should update user age when age is positive', async () => {
      const user = await userService.createUser({
        email: 'test@example.com',
        name: 'Test User',
        age: 25
      });

      await userService.updateUserAge(user.id, 30);

      const updatedUser = userService.getUserById(user.id);
      expect(updatedUser?.age).toBe(30);
    });
  });
});
