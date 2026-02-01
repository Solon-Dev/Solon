import UserService from '../userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe('getAverageAge', () => {
    it('should return 0 when there are no users', () => {
      expect(service.getAverageAge()).toBe(0);
    });

    it('should calculate average age correctly with users', async () => {
        // Add some users to verify it still works normally
        await service.createUser({ email: 'test1@test.com', name: 'Test 1', age: 20 });
        await service.createUser({ email: 'test2@test.com', name: 'Test 2', age: 40 });
        expect(service.getAverageAge()).toBe(30);
    });
  });
});
