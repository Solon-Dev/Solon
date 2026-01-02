
import { POST } from '@/app/api/analyze/route';

// Force node environment as Route Handlers run in Node/Edge
/** @jest-environment node */

describe('API Stack Trace Leakage', () => {
  // Save original env
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should not leak stack trace when request body is malformed', async () => {
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: '{ "invalid": json }', // This is not valid JSON
    });

    const response = await POST(req);
    const data = await response.json();

    console.log('DEBUG: Response data:', JSON.stringify(data, null, 2));

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
    expect(data.stack).toBeUndefined();
  });
});
