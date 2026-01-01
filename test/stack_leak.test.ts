/**
 * @jest-environment node
 */
import { POST } from '@/app/api/analyze/route';
import { NextResponse } from 'next/server';

// Mock NextResponse.json to just return the object for easier testing
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      json: async () => body,
      status: init?.status || 200,
    })),
  },
}));

// Mock the dependencies
jest.mock('@/lib/config/loadPlaybookConfig', () => ({
  loadEnabledPlaybooks: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/utils/languageDetector', () => ({
  detectLanguageFromDiff: jest.fn().mockReturnValue('typescript'),
  getLanguageConfig: jest.fn().mockReturnValue({
    language: 'typescript',
    expertise: 'TypeScript',
    testFramework: 'jest',
  }),
  getLanguageBestPractices: jest.fn().mockReturnValue(''),
  getLanguageSecurityConsiderations: jest.fn().mockReturnValue(''),
}));

// Mock fetch to simulate failure
global.fetch = jest.fn();

describe('POST /api/analyze', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should not leak stack trace when an error occurs', async () => {
    // Arrange: Simulate an internal error by making request.json() fail
    const request = {
      json: jest.fn().mockRejectedValue(new Error('Simulated JSON parse error')),
    } as unknown as Request;

    // Act
    const response = await POST(request);
    const body = await (response as any).json();

    // Assert
    expect(response.status).toBe(500);
    expect(body.error).toBe('Internal server error');

    // VERIFY VULNERABILITY: This expectation should FAIL if the vulnerability exists
    // We expect stack to be UNDEFINED in a secure application
    expect(body.stack).toBeUndefined();
  });
});
