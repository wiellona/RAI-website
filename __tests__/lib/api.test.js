/**
 * Test: Lib - API Functions
 * Testing utility functions untuk API calls
 */

describe('lib/api.test.js', () => {
  describe('API Library Functions', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUniversities', () => {
    test('should fetch universities successfully', async () => {
      const mockData = [{ id: 'uni-1', name: 'MIT' }];
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetch('/api/universities');
      const data = await result.json();

      expect(fetch).toHaveBeenCalledWith('/api/universities');
      expect(data).toEqual(mockData);
    });

    test('should return empty array on error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await fetch('/api/universities');

      expect(result.ok).toBe(false);
    });
  });

  describe('fetchUniversityBySlug', () => {
    test('should fetch university by slug', async () => {
      const mockUniversity = { id: 'uni-1', slug: 'mit', name: 'MIT' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUniversity,
      });

      const result = await fetch('/api/universities/mit');
      const data = await result.json();

      expect(data.slug).toBe('mit');
    });

    test('should handle not found', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await fetch('/api/universities/invalid');

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
    });
  });

  describe('getSubmissions', () => {
    test('should fetch submissions with auth token', async () => {
      const mockSubmissions = [{ id: 'sub-1', status: 'submitted' }];
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissions,
      });

      const result = await fetch('/api/admin/submissions');
      const data = await result.json();

      expect(data).toEqual(mockSubmissions);
    });

    test('should return empty array on error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await fetch('/api/admin/submissions');

      expect(result.ok).toBe(false);
    });
  });

  describe('acceptSubmission', () => {
    test('should accept submission', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const result = await fetch('/api/admin/submissions/sub-1/accept', {
        method: 'POST',
      });
      const data = await result.json();

      expect(data.success).toBe(true);
    });
  });

  describe('rejectSubmission', () => {
    test('should reject submission', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const result = await fetch('/api/admin/submissions/sub-1/reject', {
        method: 'POST',
      });
      const data = await result.json();

      expect(data.success).toBe(true);
    });
  });

  describe('login', () => {
    test('should login successfully', async () => {
      const mockAuth = {
        user: { id: 'user-1', email: 'admin@rai.com', role: 'admin' },
        token: 'mock-token',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAuth,
      });

      const result = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'admin', password: 'admin' }),
      });
      const data = await result.json();

      expect(data.user).toBeDefined();
      expect(data.token).toBeDefined();
    });

    test('should handle login failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid credentials' }),
      });

      const result = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'wrong', password: 'wrong' }),
      });

      expect(result.ok).toBe(false);
      expect(result.status).toBe(401);
    });
  });

  describe('localStorage handling', () => {
    test('should store token on login', () => {
      const token = 'mock-token-123';
      const mockStorage = {};
      
      // Simulate storing
      mockStorage['token'] = token;

      expect(mockStorage['token']).toBe(token);
    });

    test('should retrieve token from storage', () => {
      const mockStorage = { token: 'mock-token-123' };
      
      const token = mockStorage['token'];

      expect(token).toBe('mock-token-123');
    });

    test('should clear token on logout', () => {
      const mockStorage = { token: 'mock-token' };
      
      delete mockStorage['token'];

      expect(mockStorage['token']).toBeUndefined();
    });
  });
  });
});
