/**
 * @jest-environment node
 */
import { POST } from '../route';
import { NextRequest, NextResponse } from 'next/server';

// Mock the dependencies
jest.mock('@/lib/config/loadPlaybookConfig', () => ({
  loadEnabledPlaybooks: jest.fn().mockImplementation(() => {
    throw new Error('Test Error For Stack Trace');
  })
}));

jest.mock('@/utils/languageDetector', () => ({
  detectLanguageFromDiff: jest.fn().mockReturnValue('typescript'),
  getLanguageConfig: jest.fn().mockReturnValue({
    language: 'typescript',
    expertise: 'TypeScript',
    testFramework: 'jest',
    syntaxHighlight: 'typescript',
    testFileExtension: '.test.ts'
  }),
  getLanguageBestPractices: jest.fn(),
  getLanguageSecurityConsiderations: jest.fn(),
}));

describe('POST /api/analyze - Security Test', () => {
  let jsonSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Silence console.error during test
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Spy on NextResponse.json
    // We need to make sure we are spying on the correct object.
    // In some environments, Next.js exports might need to be mocked differently.
    // However, trying spyOn first is better practice.
    // But since NextResponse is a class, we might need to mock the static method.
    // If spyOn fails because property is not writable/configurable, we fall back.
    jsonSpy = jest.spyOn(NextResponse, 'json');
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
    jsonSpy.mockRestore();
  });

  it('prevents stack trace leakage', async () => {
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: 'some diff' }),
    });

    await POST(req);

    // Verify that json was called
    expect(jsonSpy).toHaveBeenCalled();

    // Get the response body passed to json()
    const responseBody = jsonSpy.mock.calls[0][0];
    const responseInit = jsonSpy.mock.calls[0][1];

    // Verify it is an error 500
    expect(responseInit.status).toBe(500);

    // CRITICAL: Check that stack trace is NOT leaked
    expect(responseBody).not.toHaveProperty('stack');
    expect(responseBody.error).toBe('Internal server error');

    // Check that error was logged server-side
    expect(console.error).toHaveBeenCalled();
  });
});
