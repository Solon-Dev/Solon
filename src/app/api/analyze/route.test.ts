/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextResponse } from 'next/server';

// Mock the global fetch
global.fetch = jest.fn();

describe('POST /api/analyze - Security Vulnerability: Stack Trace Leakage', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.ANTHROPIC_API_KEY = 'test-api-key';
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should NOT include stack trace in error response', async () => {
    // Simulate a fetch error from Anthropic API
    const errorMessage = 'Network error or API failure';
    (global.fetch as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: 'some diff' }),
    });

    const response = await POST(request);

    // Check status
    expect(response.status).toBe(500);

    const data = await response.json();

    // Check for error message
    expect(data.error).toContain('Claude API analysis failed');

    // Check that stack trace is NOT leaked
    expect(data.stack).toBeUndefined();
  });
});
