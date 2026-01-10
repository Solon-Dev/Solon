/**
 * @jest-environment node
 */
import { POST } from './route';

// Mock console.error to avoid polluting test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

// Restore fetch after tests
const originalFetch = global.fetch;
afterAll(() => {
  global.fetch = originalFetch;
});

describe('POST /api/analyze Security Tests', () => {
  it('should NOT leak stack trace on internal error', async () => {
    // Mock request.json() to throw an error
    const request = {
      json: jest.fn().mockRejectedValue(new Error('Simulated internal error')),
    } as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error', 'Internal server error');

    // VERIFY FIX: Stack trace IS NOT leaked
    expect(data).not.toHaveProperty('stack');
  });

  it('should NOT leak stack trace when Claude API fails', async () => {
    // Setup request with valid body
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: 'valid diff' }),
    });

    // Mock fetch to simulate API failure
    global.fetch = jest.fn().mockRejectedValue(new Error('API Connection Failed'));

    // Mock process.env to ensure we pass the API key check
    process.env.ANTHROPIC_API_KEY = 'test-key';

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);

    // VERIFY FIX: Stack trace IS NOT leaked from callClaudeAPI
    expect(data).not.toHaveProperty('stack');
  });
});
