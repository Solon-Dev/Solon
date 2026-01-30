/**
 * @jest-environment node
 */
import { POST } from '../route';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, init, status: init?.status || 200 })),
  },
}));

// Mock loadEnabledPlaybooks
jest.mock('@/lib/config/loadPlaybookConfig', () => ({
  loadEnabledPlaybooks: jest.fn().mockResolvedValue([]),
}));

describe('POST /api/analyze - Input Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, ANTHROPIC_API_KEY: 'test-key' };
    jest.clearAllMocks();

    // Default mock for fetch to return success
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: JSON.stringify({
          summary: "Good code",
          edgeCases: [],
          unitTests: { filePath: "test.ts", code: "test code" }
        }) }]
      })
    });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return 413 if diff is too large', async () => {
    // Create a diff larger than 500,000 characters
    const largeDiff = 'a'.repeat(500001);

    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: largeDiff }),
    });

    const response = await POST(req);

    // Check response status
    // @ts-expect-error - we mocked NextResponse
    expect(response.status).toBe(413);

    // @ts-expect-error - we mocked NextResponse
    const body = response.body;
    expect(body).toHaveProperty('error', 'Diff too large');
  });

  it('should process normal sized diff', async () => {
    const normalDiff = 'valid diff';

    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: normalDiff }),
    });

    const response = await POST(req);

    // Check response status
    // @ts-expect-error - we mocked NextResponse
    expect(response.status).toBe(200);
  });
});
