/** @jest-environment node */
import { POST } from '../route';

const originalEnv = process.env;
const originalFetch = global.fetch;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
  process.env.ANTHROPIC_API_KEY = 'test-key';
});

afterEach(() => {
  global.fetch = originalFetch;
});

afterAll(() => {
  process.env = originalEnv;
});

describe('POST /api/analyze - Security Vulnerability Check', () => {
  it('should NOT expose stack trace in error response', async () => {
    // Mock fetch to throw an error
    global.fetch = jest.fn().mockImplementation(() => {
      throw new Error('Simulated network failure');
    });

    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: 'some diff' }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');

    // Verification: stack trace should NOT be leaked to the client
    expect(data).not.toHaveProperty('stack');
    expect(data.stack).toBeUndefined();

    // But error message should still be there
    expect(data.error).toContain('Claude API analysis failed');
    expect(data.details).toBeUndefined(); // details is only for specific errors, catch block returns error message in error field
  });
});
