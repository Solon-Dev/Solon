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

describe('POST /api/analyze', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, ANTHROPIC_API_KEY: 'test-key' };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should not leak stack traces when API call fails', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn().mockRejectedValue(new Error('Simulated API failure'));

    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: 'some diff' }),
    });

    const response = await POST(req);

    // Check response status
    // @ts-expect-error - we mocked NextResponse to return the object directly for inspection
    expect(response.status).toBe(500);

    // @ts-expect-error - we mocked NextResponse
    const body = response.body;

    expect(body).toHaveProperty('error');
    expect(body).not.toHaveProperty('stack');
  });

  it('should return 413 if diff is too large (>500KB)', async () => {
    // Create a large string > 500,000 chars
    const largeDiff = 'a'.repeat(500001);

    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: largeDiff }),
    });

    const response = await POST(req);

    // @ts-expect-error - we mocked NextResponse
    expect(response.status).toBe(413);

    // @ts-expect-error - we mocked NextResponse
    const body = response.body;
    expect(body.error).toContain('Diff is too large');
  });
});
