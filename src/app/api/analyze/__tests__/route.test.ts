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

    const res = response as unknown as { status: number; body: Record<string, unknown> };
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
    expect(res.body).not.toHaveProperty('stack');
  });

  it('should return 413 if diff is too large', async () => {
    const largeDiff = 'a'.repeat(500001);
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: largeDiff }),
    });

    const response = await POST(req);

    const res = response as unknown as { status: number; body: Record<string, unknown> };
    expect(res.status).toBe(413);
    expect(res.body).toHaveProperty('error');
    expect(String(res.body.error)).toContain('too large');
  });
});
