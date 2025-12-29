/**
 * @jest-environment node
 */
import { POST } from '@/app/api/analyze/route';

// Mock the dependencies to force an error
jest.mock('@/lib/config/loadPlaybookConfig', () => ({
  loadEnabledPlaybooks: jest.fn().mockImplementation(() => {
    throw new Error('Simulated failure');
  }),
}));

describe('API Stack Trace Leakage', () => {
  it('should NOT expose stack trace in error response (VULNERABILITY FIX)', async () => {
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ diff: 'test diff' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Internal server error');

    // VERIFICATION: Stack trace should NOT be present
    expect(data).not.toHaveProperty('stack');
  });
});
