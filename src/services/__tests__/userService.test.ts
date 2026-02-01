import UserService from '../userService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getOldestUser', () => {
    it('should return null when there are no users', () => {
      expect(userService.getOldestUser()).toBeNull();
    });

    it('should return the user when there is only one user', async () => {
      const user = await userService.createUser({
        email: 'test@example.com',
        name: 'Test User',
        age: 30
      });
      expect(userService.getOldestUser()).toEqual(user);
    });

    it('should return the user with the highest age', async () => {
      await userService.createUser({
        email: 'young@example.com',
        name: 'Young User',
        age: 20
      });
      const oldUser = await userService.createUser({
        email: 'old@example.com',
        name: 'Old User',
        age: 50
      });
      await userService.createUser({
        email: 'middle@example.com',
        name: 'Middle User',
        age: 30
      });

      expect(userService.getOldestUser()).toEqual(oldUser);
    });

    it('should return the user created first when multiple users have the same max age', async () => {
      // Set time to T2 (later)
      jest.setSystemTime(new Date('2023-01-02'));
      const userCreatedLater = await userService.createUser({
        email: 'later@example.com',
        name: 'Later User',
        age: 50
      });

      // Set time to T1 (earlier)
      jest.setSystemTime(new Date('2023-01-01'));
      const userCreatedEarlier = await userService.createUser({
        email: 'earlier@example.com',
        name: 'Earlier User',
        age: 50
      });

      // Currently, userCreatedLater is at index 0, userCreatedEarlier is at index 1.
      // Both have age 50.
      // Current implementation returns index 0 (userCreatedLater).
      // Desired implementation should return userCreatedEarlier because it has earlier createdAt.

      const oldest = userService.getOldestUser();

      // Verify our setup created users with correct dates
      expect(userCreatedLater.createdAt.getTime()).toBeGreaterThan(userCreatedEarlier.createdAt.getTime());

      // The actual assertion
      expect(oldest).toEqual(userCreatedEarlier);
    });
  });
});
