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

describe('POST /api/analyze limit', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, ANTHROPIC_API_KEY: 'test-key' };
    jest.clearAllMocks();

    // Mock fetch to succeed by default
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: JSON.stringify({ summary: 'ok', edgeCases: [], unitTests: { filePath: 'foo', code: 'bar' } }) }]
      })
    });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return 413 if diff is too large', async () => {
    const largeDiff = 'a'.repeat(500001);
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: largeDiff }),
    });

    const response = await POST(req);

    // @ts-expect-error - we mocked NextResponse
    expect(response.status).toBe(413);
  });
});
