
import UserService from '../userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe('calculateDiscountedAge', () => {
    test('should calculate correct discount for 10% on 30', async () => {
      const user = await service.createUser({
        email: 'test@example.com',
        name: 'Test',
        age: 30
      });
      const result = service.calculateDiscountedAge(user.id, 10);
      expect(result).toBe(27);
    });

    test('should fail with floating point issues on 33%', async () => {
      // 30 * 33% = 9.9
      // 30 - 9.9 = 20.1
      // Floating point: 20.1 might be 20.100000000000000001
      const user = await service.createUser({
        email: 'test2@example.com',
        name: 'Test2',
        age: 30
      });
      const result = service.calculateDiscountedAge(user.id, 33);
      // We expect it to be close to 20.1, but exact match might fail if we don't fix it
      expect(result).toBeCloseTo(20.1);
    });

    test('should handle validation of discount range', async () => {
       const user = await service.createUser({
        email: 'test3@example.com',
        name: 'Test3',
        age: 30
      });
       expect(() => service.calculateDiscountedAge(user.id, -10)).toThrow();
       expect(() => service.calculateDiscountedAge(user.id, 110)).toThrow();
    });

     test('should throw error if user not found', () => {
       expect(() => service.calculateDiscountedAge("nonexistent", 10)).toThrow();
    });
  });
});
