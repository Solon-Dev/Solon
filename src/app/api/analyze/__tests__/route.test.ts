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
  });
});
