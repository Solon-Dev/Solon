/** @jest-environment node */
import UserService from '../userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const user = await service.createUser({
        email: 'test@example.com',
        name: 'Test User',
        age: 30
      });

      const foundUser = service.getUserById(user.id);
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(user.id);
    });

    it('should throw error when user not found', () => {
      expect(() => {
        service.getUserById('non-existent-id');
      }).toThrow('User not found');
    });
  });

  describe('updateUserAge', () => {
    it('should update age when user exists', async () => {
      const user = await service.createUser({
        email: 'test@example.com',
        name: 'Test User',
        age: 30
      });

      await service.updateUserAge(user.id, 35);
      const updatedUser = service.getUserById(user.id);
      expect(updatedUser?.age).toBe(35);
    });

    it('should throw error when user does not exist', async () => {
      await expect(service.updateUserAge('non-existent', 35)).rejects.toThrow('User not found');
    });
  });

  describe('calculateDiscountedAge', () => {
    it('should calculate discount when user exists', async () => {
      const user = await service.createUser({
        email: 'test@example.com',
        name: 'Test User',
        age: 100
      });

      const discounted = service.calculateDiscountedAge(user.id, 10);
      expect(discounted).toBe(90);
    });

    it('should throw error when user does not exist', () => {
      expect(() => {
        service.calculateDiscountedAge('non-existent', 10);
      }).toThrow('User not found');
    });
  });
});
