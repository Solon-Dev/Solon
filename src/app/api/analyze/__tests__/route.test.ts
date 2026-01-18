/** @jest-environment node */
import { POST } from '../route';

describe('POST /api/analyze', () => {
  it('does NOT leak stack trace on error', async () => {
    // Create a request that throws an error when json() is called
    const req = {
      json: jest.fn().mockRejectedValue(new Error('Test Error')),
    } as unknown as Request;

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toHaveProperty('error');

    // Stack trace should be REMOVED for security
    expect(body).not.toHaveProperty('stack');

    // Should still have other details
    expect(body).toHaveProperty('details');
  });
});
