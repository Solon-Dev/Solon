
import { loadEnabledPlaybooks } from '@/lib/config/loadPlaybookConfig';

// Mock next/server to avoid environment issues
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      json: () => Promise.resolve(body),
      status: init?.status || 200,
      body: body
    })),
  },
}));

// Mock the dependency
jest.mock('@/lib/config/loadPlaybookConfig', () => ({
  loadEnabledPlaybooks: jest.fn(),
}));

// We need to import POST after mocking
// Use require to ensure mocks are applied
const { POST } = require('@/app/api/analyze/route');

describe('API Analyze Security', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('does NOT leak stack traces in error responses', async () => {
    // Setup the mock to throw an error
    (loadEnabledPlaybooks as jest.Mock).mockRejectedValue(new Error('Simulated internal error'));

    // Create a mock request
    const request = {
      json: jest.fn().mockResolvedValue({ diff: 'some diff' }),
    } as unknown as Request;

    const response = await POST(request);

    // Check the response body directly from our mock
    const data = response.body;

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
    expect(data.details).toBe("Simulated internal error");

    // This confirms the vulnerability is fixed:
    expect(data.stack).toBeUndefined();
  });
});
