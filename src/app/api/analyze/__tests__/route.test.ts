/** @jest-environment node */
import { POST } from '../route';

// Mock NextResponse to inspect the body
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      json: async () => body,
      status: init?.status || 200,
    })),
  },
}));

// Mock the language detector to throw an error
jest.mock('@/utils/languageDetector', () => ({
  detectLanguageFromDiff: jest.fn(() => {
    throw new Error('Simulated security failure');
  }),
  getLanguageConfig: jest.fn(),
}));

jest.mock('@/lib/config/loadPlaybookConfig', () => ({
  loadEnabledPlaybooks: jest.fn().mockResolvedValue([]),
}));

describe('POST /api/analyze - Security', () => {
  it('should currently leak stack traces on error (Vulnerability Check)', async () => {
    const req = {
      json: async () => ({ diff: 'some diff' }),
    } as unknown as Request;

    const response = await POST(req);
    // @ts-expect-error - mock returns simple object
    const body = await response.json();

    // Verify status code is 500
    expect(response.status).toBe(500);

    // Verify error message matches
    expect(body.error).toBe('Internal server error');
    expect(body.details).toBe('Simulated security failure');

    // VERIFICATION: Stack trace should NOT be present
    expect(body.stack).toBeUndefined();
  });
});
