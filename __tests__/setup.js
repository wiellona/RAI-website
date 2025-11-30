/**
 * Jest Test Setup
 * Global configuration for all tests
 */

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.GEMINI_API_KEY = 'test-gemini-key';

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock window
global.window = {
  location: {
    href: 'http://localhost:3000',
  },
};

// Mock fetch
global.fetch = jest.fn();

console.log('✅ Test environment setup complete');
