/**
 * @jest-environment node
 */
import { POST } from '../route';
import { NextResponse } from 'next/server';

// Mock Next.js Request and NextResponse
class MockRequest extends Request {
  constructor(url: string, init?: RequestInit) {
    super(url, init);
  }
}

// Mocking dependencies
jest.mock('@/lib/config/loadPlaybookConfig', () => ({
  loadEnabledPlaybooks: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/utils/languageDetector', () => ({
  detectLanguageFromDiff: jest.fn().mockReturnValue('javascript'),
  getLanguageConfig: jest.fn().mockReturnValue({
    language: 'javascript',
    expertise: 'JavaScript',
    syntaxHighlight: 'javascript',
    testFramework: 'jest',
    testFileExtension: '.test.js'
  }),
  getLanguageBestPractices: jest.fn().mockReturnValue('- Use const/let\n- Async/await'),
  getLanguageSecurityConsiderations: jest.fn().mockReturnValue('- No eval\n- Input sanitization')
}));

// Mock fetch
global.fetch = jest.fn();

// Mock console.error to prevent pollution
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('Analyze API Route', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, ANTHROPIC_API_KEY: 'test-key' };
    (global.fetch as jest.Mock).mockClear();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return 400 if diff is missing', async () => {
    const request = new MockRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Valid diff string is required');
  });

  it('should return 413 if diff is too large', async () => {
    const largeDiff = 'a'.repeat(100 * 1024 + 1);
    const request = new MockRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: largeDiff }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(413);
    expect(data.error).toBe('Diff is too large. Maximum allowed size is 100KB.');
  });

  it('should return 500 without stack trace when API fails', async () => {
    // Mock fetch to throw error
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Simulated API Failure'));

    const request = new MockRequest('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: 'some diff' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
    expect(data.details).toBe('Claude API analysis failed: Simulated API Failure');
    // Verify stack trace IS NOT present (confirming the fix)
    expect(data.stack).toBeUndefined();
  });
});
