
import { POST } from './route';
import { loadEnabledPlaybooks } from '@/lib/config/loadPlaybookConfig';

// Mock dependencies
jest.mock('@/lib/config/loadPlaybookConfig', () => ({
  loadEnabledPlaybooks: jest.fn(),
}));

jest.mock('@/utils/languageDetector', () => ({
  detectLanguageFromDiff: jest.fn().mockReturnValue('javascript'),
  getLanguageConfig: jest.fn().mockReturnValue({
    language: 'javascript',
    expertise: 'JavaScript',
    syntaxHighlight: 'javascript',
    testFramework: 'Jest',
    testFileExtension: '.test.js'
  }),
  getLanguageBestPractices: jest.fn().mockReturnValue(''),
  getLanguageSecurityConsiderations: jest.fn().mockReturnValue(''),
}));

// Mock next/server to avoid Request/Response issues
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn().mockImplementation((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        };
      }),
    },
  };
});

describe('POST /api/analyze', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('does NOT expose stack trace in error response', async () => {
    // Arrange
    const mockError = new Error('Test Error');
    (loadEnabledPlaybooks as jest.Mock).mockRejectedValue(mockError);

    // Mock Request object
    const request = {
      json: async () => ({ diff: 'some diff' }),
    } as unknown as Request;

    // Act
    const response = await POST(request);

    // Check if response is defined
    expect(response).toBeDefined();

    // Since we mocked NextResponse.json to return a plain object with a json method
    const body = await (response as any).json();

    // Assert
    expect(response.status).toBe(500);
    expect(body).toHaveProperty('error', 'Internal server error');
    expect(body).toHaveProperty('details', 'Test Error');
    // This assertion confirms the vulnerability is fixed
    expect(body).not.toHaveProperty('stack');
  });
});
