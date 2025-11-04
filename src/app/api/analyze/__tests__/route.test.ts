import { NextResponse } from 'next/server';

// Mock the Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => {
    return {
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [
            {
              type: 'text',
              text: `{
                "summary": "This is a test summary.",
                "edgeCases": ["Test edge case 1", "Test edge case 2"],
                "unitTests": {
                  "filePath": "src/utils/__tests__/test.test.ts",
                  "code": "test('should do something', () => { expect(true).toBe(true); });"
                }
              }`,
            },
          ],
        }),
      },
    };
  });
});

describe('POST /api/analyze', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, ANTHROPIC_API_KEY: 'test-key' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return a 200 success response when the API call is successful', async () => {
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diff: 'test diff' }),
    });

    const { POST } = require('../route');
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.summary).toBe("This is a test summary.");
    expect(body.edgeCases).toEqual(["Test edge case 1", "Test edge case 2"]);
    expect(body.unitTests.filePath).toBe("src/utils/__tests__/test.test.ts");
  });

  it('should return a 400 error if no diff is provided', async () => {
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const { POST } = require('../route');
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Valid diff string is required');
  });

  it('should return a 500 error if the API call fails', async () => {
    // Mock a failed API call
    const Anthropic = require('@anthropic-ai/sdk');
    Anthropic.mockImplementation(() => {
      return {
        messages: {
          create: jest.fn().mockRejectedValue(new Error('API call failed')),
        },
      };
    });

    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diff: 'test diff' }),
    });

    const { POST } = require('../route');
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain('Claude API analysis failed');
  });
});
