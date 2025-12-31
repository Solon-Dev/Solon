/**
 * @jest-environment node
 */
import { POST } from '../src/app/api/analyze/route';

// Mock process.env
const originalEnv = process.env;

describe('API Stack Trace Leakage', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should not leak stack traces in error responses', async () => {
    // Mock the Request object
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: 'invalid diff that causes error' }),
    });

    // Mock fetch to throw an error to simulate an internal failure
    global.fetch = jest.fn(() => Promise.reject(new Error('Simulated API failure')));

    // Ensure API key is set so it tries to call the API
    process.env.ANTHROPIC_API_KEY = 'test-key';

    const response = await POST(request);
    const data = await response.json();

    // Verify error presence
    expect(data).toHaveProperty('error');

    // VERIFY VULNERABILITY: Stack trace should NOT be present
    // Currently, we expect this to FAIL if the code is vulnerable (it will have 'stack')
    // But for the purpose of TDD, we write the test asserting security.
    // If it fails, we have confirmed the vulnerability.
    expect(data).not.toHaveProperty('stack');
  });
});
