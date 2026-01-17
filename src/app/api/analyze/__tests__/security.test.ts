/** @jest-environment node */
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock console.error to avoid noise during test
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('POST /api/analyze Security', () => {
  it('should not leak stack traces on error', async () => {
    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: 'some-diff' }),
    });

    // Mock request.json to throw an error
    request.json = jest.fn().mockRejectedValue(new Error('Simulated failure'));

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
    // Stack trace should NOT be present
    expect(data.stack).toBeUndefined();

    // Server-side logging should have happened
    expect(console.error).toHaveBeenCalledWith('API Error:', expect.any(Error));
  });

  it('should reject extremely large diffs (DoS protection)', async () => {
    const largeDiff = 'a'.repeat(500001); // 1 char over limit
    const request = new NextRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: largeDiff }),
    });

    // We don't need to mock request.json here because we provided a valid body stringified
    // However, the real request.json() parses the stream. NextRequest/Response mocks in Jest usually don't handle streams perfectly without more setup.
    // So we can mock json() to return our object.
    request.json = jest.fn().mockResolvedValue({ diff: largeDiff });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(413); // Payload Too Large
    expect(data.error).toBe('Diff too large');
  });
});
