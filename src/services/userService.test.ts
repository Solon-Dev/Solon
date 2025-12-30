import UserService from './userService';

describe('UserService Performance', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  test('deactivateInactiveUsers should be performant and correct', async () => {
    const userCount = 10000;

    // Create users, half active, half inactive
    for (let i = 0; i < userCount; i++) {
      const isActive = i % 2 === 0;
      await service.createUser({
        email: `user${i}@example.com`,
        name: `User ${i}`,
        age: 20 + (i % 50)
      });
      // Hack to set active state since createUser defaults to true
      const users = service.getAllUsers();
      const user = users.find(u => u.email === `user${i}@example.com`);
      if (user) {
        user.isActive = isActive;
      }
    }

    // Verify initial count
    expect(service.getAllUsers().length).toBe(userCount);

    const startTime = performance.now();
    service.deactivateInactiveUsers();
    const endTime = performance.now();

    const duration = endTime - startTime;
    console.log(`deactivateInactiveUsers took ${duration.toFixed(2)}ms for ${userCount} users`);

    // Verify correctness
    // It should have removed all inactive users (5000)
    // The buggy implementation (splice in loop) skips elements, so it won't remove all of them.
    // Specifically, if we have [I, I, I], at index 0 it removes first I. Array is [I, I]. Next loop index 1. It checks the *new* index 1, which is the 3rd element originally.
    // So it skips the 2nd element.

    const remainingUsers = service.getAllUsers();
    const inactiveRemaining = remainingUsers.filter(u => !u.isActive).length;

    // If the bug exists, inactiveRemaining will be > 0
    // If fixed, it should be 0
    // Also check total count. Should be 5000.

    // For now, let's just assert that it runs. We expect this to fail if we enforce correctness,
    // or we can use it to demonstrate the fix.

    expect(inactiveRemaining).toBe(0);
    expect(remainingUsers.length).toBe(userCount / 2);
  });
});
