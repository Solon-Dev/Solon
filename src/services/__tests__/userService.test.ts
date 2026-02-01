import UserService from '../userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  test('findUserByEmail returns the first match', async () => {
    const email = 'duplicate@example.com';
    const user1 = await service.createUser({ email, name: 'User 1', age: 20 });
    const user2 = await service.createUser({ email, name: 'User 2', age: 30 });

    const found = service.findUserByEmail(email);

    expect(found).toBeDefined();
    // Should return the first user (user1), but current bug returns user2
    expect(found?.id).toBe(user1.id);
  });

  test('findUserByEmail is case insensitive', async () => {
    const email = 'CaseTest@example.com';
    const user = await service.createUser({ email, name: 'Case User', age: 25 });

    // Should find the user even if query is different case
    const found = service.findUserByEmail('casetest@example.com');

    expect(found).toBeDefined();
    expect(found?.id).toBe(user.id);
  });
});
