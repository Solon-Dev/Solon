/** @jest-environment node */
import { POST } from '../src/app/api/analyze/route';
import { NextResponse } from 'next/server';

// Mock NextResponse.json to capture the response
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      body,
      init,
      status: init?.status || 200,
    })),
  },
}));

describe('API Error Handling', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    // Mock global fetch if needed, but we are mocking request.json failure first
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should not leak stack trace on internal server error', async () => {
    // Force an error by mocking request.json to throw
    const request = {
      json: jest.fn().mockRejectedValue(new Error('Simulated internal error')),
    } as unknown as Request;

    const response = await POST(request);
    const body = (response as any).body;

    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Internal server error');

    // This is the critical check - stack should NOT be present
    expect(body).not.toHaveProperty('stack');
  });

  it('should not leak stack trace from callClaudeAPI error', async () => {
     // Mock request to be valid
     const request = {
        json: jest.fn().mockResolvedValue({ diff: 'some diff' }),
      } as unknown as Request;

      // Mock fetch to throw to simulate an error inside callClaudeAPI
      // We need to restore fetch after this test
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('Fetch failed'));

      try {
        const response = await POST(request);
        const body = (response as any).body;

        // The current implementation returns the error object from callClaudeAPI directly
        // which might include the stack.
        expect(body).toHaveProperty('error');
        expect(body).not.toHaveProperty('stack');
      } finally {
        global.fetch = originalFetch;
      }
  });
});
