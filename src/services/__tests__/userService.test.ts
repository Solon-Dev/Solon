import UserService from '../userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  test('deactivateInactiveUsers removes all inactive users including consecutive ones', async () => {
    // Create 3 users
    await service.createUser({ email: 'user1@example.com', name: 'User 1', age: 20 });
    await service.createUser({ email: 'user2@example.com', name: 'User 2', age: 25 });
    await service.createUser({ email: 'user3@example.com', name: 'User 3', age: 30 });

    // Get users and mark the first two as inactive
    const users = service.getAllUsers();
    expect(users).toHaveLength(3);

    users[0].isActive = false; // user1
    users[1].isActive = false; // user2
    // user3 remains active

    // Call the method to test
    service.deactivateInactiveUsers();

    // Verify results
    const remainingUsers = service.getAllUsers();

    // With the bug, user2 might be skipped because user1 was removed and indices shifted
    // Expected: Only user3 remains
    expect(remainingUsers).toHaveLength(1);
    expect(remainingUsers[0].name).toBe('User 3');
    expect(remainingUsers[0].isActive).toBe(true);
  });
});
