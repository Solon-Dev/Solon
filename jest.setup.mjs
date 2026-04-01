// Jest setup file for configuring testing environment
import '@testing-library/jest-dom';

// Provide required env vars for tests so modules that validate them at import time don't throw
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key';
