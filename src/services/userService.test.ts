
import UserService from './userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  describe('deactivateInactiveUsers', () => {
    it('should remove all inactive users from the users array', async () => {
      // Add multiple users, some inactive, some consecutive
      const user1 = await service.createUser({ email: 'u1@example.com', name: 'User 1', age: 20 });
      const user2 = await service.createUser({ email: 'u2@example.com', name: 'User 2', age: 20 });
      const user3 = await service.createUser({ email: 'u3@example.com', name: 'User 3', age: 20 });
      const user4 = await service.createUser({ email: 'u4@example.com', name: 'User 4', age: 20 });

      // Mark user 2 and 3 as inactive (consecutive)
      user2.isActive = false;
      user3.isActive = false;

      service.deactivateInactiveUsers();

      const allUsers = service.getAllUsers();
      expect(allUsers.length).toBe(2);
      expect(allUsers.find(u => u.email === 'u1@example.com')).toBeDefined();
      expect(allUsers.find(u => u.email === 'u4@example.com')).toBeDefined();
      expect(allUsers.find(u => u.email === 'u2@example.com')).toBeUndefined();
      expect(allUsers.find(u => u.email === 'u3@example.com')).toBeUndefined();
    });
  });
});
