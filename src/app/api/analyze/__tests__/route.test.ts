
/** @jest-environment node */
import { POST } from '../route';

// Mock NextResponse to inspect the response
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      json: jest.fn((body, init) => ({
        body,
        init,
        status: init?.status || 200,
        json: async () => body,
      })),
    },
  };
});

describe('POST /api/analyze', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env;
  const originalConsoleError = console.error;

  beforeEach(() => {
    process.env = { ...originalEnv, ANTHROPIC_API_KEY: 'test-key' };
    global.fetch = jest.fn();
    console.error = jest.fn(); // Suppress expected error logs
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    console.error = originalConsoleError;
  });

  it('should not leak stack trace when request.json() fails', async () => {
    const req = {
      json: jest.fn().mockRejectedValue(new Error('Test error')),
    } as unknown as Request;

    const response = await POST(req);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = (response as any).body;

    expect(response.status).toBe(500);
    expect(body).toHaveProperty('error');
    expect(body).not.toHaveProperty('stack'); // Verification

    // Verify it was logged server-side
    expect(console.error).toHaveBeenCalled();
  });

  it('should not leak stack trace when API call fails unexpectedly', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const req = {
      json: jest.fn().mockResolvedValue({ diff: 'test diff' }),
    } as unknown as Request;

    const response = await POST(req);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = (response as any).body;

    expect(response.status).toBe(500);
    expect(body).toHaveProperty('error');
    expect(body).not.toHaveProperty('stack'); // Verification

    // Verify it was logged server-side
    expect(console.error).toHaveBeenCalled();
  });
});
