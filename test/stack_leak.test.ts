/**
 * @jest-environment node
 */
import { POST } from '../src/app/api/analyze/route';
import { NextResponse } from 'next/server';

// Mock process.env
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('API Stack Trace Leak', () => {
  it('should NOT expose stack trace in error response', async () => {
    // We mock the Request to throw when json() is called or provide malformed data
    // Since we can't easily mock the internal Request class methods without a polyfill in 'node' env sometimes,
    // let's try to construct a real Request with invalid JSON body.

    // However, Request constructor validates body.
    // So we will trigger an error by mocking a dependency or by sending a valid JSON that triggers logic error?
    // The route handler does: const body = await request.json();
    // If we pass a body that is not JSON, request.json() will fail.

    const req = new Request('http://localhost:3000/api/analyze', {
        method: 'POST',
        body: 'invalid json',
    });

    const response = await POST(req);
    const data = await response.json();

    // Verify fix: stack trace is NOT present
    expect(response.status).toBe(500);
    expect(data).not.toHaveProperty('stack');
  });
});
