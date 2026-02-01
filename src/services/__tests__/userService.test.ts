import UserService from '../userService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('calculateDiscountedAge', () => {
    it('should throw error when user is not found', () => {
      expect(() => {
        userService.calculateDiscountedAge('non-existent-id', 10);
      }).toThrow('User not found with ID: non-existent-id');
    });

    it('should calculate discounted age correctly when user exists', async () => {
      const user = await userService.createUser({
        email: 'test@example.com',
        name: 'Test User',
        age: 30
      });

      const result = userService.calculateDiscountedAge(user.id, 10);
      // 30 - (30 * 10 / 100) = 27
      expect(result).toBe(27);
    });
  });
});
