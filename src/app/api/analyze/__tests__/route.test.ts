main
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock the Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{
          type: 'text',
          text: JSON.stringify({
            summary: 'Test summary',
            edgeCases: ['Test edge case'],
            unitTests: {
              filePath: 'test.test.ts',
              code: 'test code'
            }
          })
        }]
      })
    }
  }));
});

describe('POST /api/analyze', () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
  });

  afterEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  it('should return 400 if no diff is provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Valid diff string is required');
  });

  it('should return 400 if diff is empty string', async () => {
    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: '   ' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Valid diff string is required');
  });

  it('should return 400 if diff is not a string', async () => {
    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: 123 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Valid diff string is required');
  });

  it('should successfully analyze a valid diff', async () => {
    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: 'some valid diff content' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('summary');
    expect(data).toHaveProperty('edgeCases');
    expect(data).toHaveProperty('unitTests');
    expect(data).toHaveProperty('formatted');
  });

  it('should return 500 for invalid JSON in request', async () => {
    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    // NextRequest's json() method throws before our handler can catch it,
    // so it returns 500 instead of 400
    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
=======
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

  it('should return a 500 error if the Claude API returns invalid JSON', async () => {
    // Mock the Anthropic SDK to return invalid JSON
    const Anthropic = require('@anthropic-ai/sdk');
    Anthropic.mockImplementation(() => {
      return {
        messages: {
          create: jest.fn().mockResolvedValue({
            content: [
              {
                type: 'text',
                text: 'This is not JSON',
              },
            ],
          }),
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

  it('should return a 500 error if the ANTHROPIC_API_KEY is not set', async () => {
    delete process.env.ANTHROPIC_API_KEY;

    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diff: 'test diff' }),
    });

    const { POST } = require('../route');
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain('ANTHROPIC_API_KEY environment variable is not set');
    code-quality-improvements
  });
});
