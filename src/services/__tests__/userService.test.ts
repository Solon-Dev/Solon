import UserService from '../userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  test('getAverageAge returns 0 when users array is empty', () => {
    const avg = service.getAverageAge();
    expect(avg).toBe(0);
  });
});
