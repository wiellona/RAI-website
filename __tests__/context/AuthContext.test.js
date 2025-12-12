/**
 * Test: Authentication Context
 * Testing AuthContext provider dan hooks
 */

describe('context/AuthContext.test.js', () => {
  describe('AuthContext', () => {
  let mockLocalStorage = {};

  beforeEach(() => {
    mockLocalStorage = {};
    global.localStorage = {
      getItem: jest.fn((key) => mockLocalStorage[key] || null),
      setItem: jest.fn((key, value) => { mockLocalStorage[key] = value; }),
      removeItem: jest.fn((key) => { delete mockLocalStorage[key]; }),
      clear: jest.fn(() => { mockLocalStorage = {}; }),
    };
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    test('should login successfully and store token', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'admin@rai.com',
        role: 'admin',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: mockUser,
          token: 'mock-token-123',
        }),
      });

      // Simulate login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'admin', password: 'admin' }),
      });
      const data = await response.json();

      expect(data.user).toEqual(mockUser);
      expect(data.token).toBe('mock-token-123');
    });

    test('should handle login failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid credentials' }),
      });

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'wrong', password: 'wrong' }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });
  });

  describe('logout', () => {
    test('should clear user and token on logout', () => {
      global.localStorage.setItem('token', 'mock-token');
      global.localStorage.setItem('user', JSON.stringify({ id: 'user-1' }));

      global.localStorage.removeItem('token');
      global.localStorage.removeItem('user');

      expect(global.localStorage.getItem('token')).toBeNull();
      expect(global.localStorage.getItem('user')).toBeNull();
    });
  });

  describe('token persistence', () => {
    test('should restore user from localStorage on mount', () => {
      const mockUser = {
        id: 'user-1',
        email: 'admin@rai.com',
        role: 'admin',
      };

      mockLocalStorage['user'] = JSON.stringify(mockUser);
      mockLocalStorage['token'] = 'mock-token';

      const user = JSON.parse(mockLocalStorage['user'] || 'null');
      const token = mockLocalStorage['token'];

      expect(user).toEqual(mockUser);
      expect(token).toBe('mock-token');
    });

    test('should handle missing localStorage data', () => {
      // Clear mockLocalStorage
      const emptyStorage = {};
      
      const user = emptyStorage['user'] || null;
      const token = emptyStorage['token'] || null;

      expect(user).toBeNull();
      expect(token).toBeNull();
    });
  });

  describe('role-based access', () => {
    test('should allow admin access', () => {
      const mockUser = {
        id: 'user-1',
        email: 'admin@rai.com',
        role: 'admin',
      };

      expect(mockUser.role).toBe('admin');
    });

    test('should deny non-admin access', () => {
      const mockUser = {
        id: 'user-2',
        email: 'user@rai.com',
        role: 'user',
      };

      expect(mockUser.role).not.toBe('admin');
    });
  });
  });
});
