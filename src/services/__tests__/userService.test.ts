
import UserService from '../userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe('getAverageAge', () => {
    test('should return 0 when there are no users', () => {
      expect(service.getAverageAge()).toBe(0);
    });

    test('should return correct average for users', async () => {
      await service.createUser({ email: 'test1@example.com', name: 'Test 1', age: 20 });
      await service.createUser({ email: 'test2@example.com', name: 'Test 2', age: 40 });

      expect(service.getAverageAge()).toBe(30);
    });
  });
});
