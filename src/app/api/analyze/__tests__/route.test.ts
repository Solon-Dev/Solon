/** @jest-environment node */
import { POST } from '../route';

describe('POST /api/analyze', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv, ANTHROPIC_API_KEY: 'test-key' };
  });

  afterAll(() => {
    global.fetch = originalFetch;
    process.env = originalEnv;
  });

  it('should not leak stack traces on error', async () => {
    // Mock fetch to throw an error
    global.fetch = jest.fn().mockRejectedValue(new Error('Simulated API failure'));

    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: 'some diff' }),
    });

    const response = await POST(request);

    if (!response) {
        throw new Error('Response is undefined');
    }

    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBeDefined();

    // Check for stack trace leakage
    expect(body.stack).toBeUndefined();
  });
});
