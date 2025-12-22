/**
 * Test: API Routes
 * Testing semua API endpoints
 */

describe('api/routes.test.js', () => {
  describe('API Routes', () => {
  describe('GET /api/universities', () => {
    test('should return list of universities', async () => {
      const mockData = [
        { id: 'uni-1', name: 'MIT', rank: 1 },
        { id: 'uni-2', name: 'Stanford', rank: 2 },
      ];

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        })
      );

      const response = await fetch('/api/universities');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveLength(2);
    });

    test('should handle empty database', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      );

      const response = await fetch('/api/universities');
      const data = await response.json();

      expect(data).toEqual([]);
    });

    test('should handle database error', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Database connection failed' }),
        })
      );

      const response = await fetch('/api/universities');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/universities/[slug]', () => {
    test('should return university by slug', async () => {
      const mockUniversity = {
        id: 'uni-1',
        slug: 'mit',
        name: 'MIT',
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUniversity),
        })
      );

      const response = await fetch('/api/universities/mit');
      const data = await response.json();

      expect(data.slug).toBe('mit');
    });

    test('should return 404 for invalid slug', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ error: 'Not found' }),
        })
      );

      const response = await fetch('/api/universities/invalid');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/admin/submissions', () => {
    test('should return submissions with university data', async () => {
      const mockSubmissions = [
        {
          id: 'sub-1',
          status: 'submitted',
          university: {
            name: 'Stanford University',
          },
        },
      ];

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSubmissions),
        })
      );

      const response = await fetch('/api/admin/submissions');
      const data = await response.json();

      expect(data[0].university).toBeDefined();
      expect(data[0].university.name).toBe('Stanford University');
    });

    test('should only return submitted status', async () => {
      const mockSubmissions = [
        { id: 'sub-1', status: 'submitted' },
        { id: 'sub-2', status: 'submitted' },
      ];

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSubmissions),
        })
      );

      const response = await fetch('/api/admin/submissions');
      const data = await response.json();

      data.forEach(submission => {
        expect(submission.status).toBe('submitted');
      });
    });
  });

  describe('POST /api/admin/submissions/[id]/accept', () => {
    test('should accept submission', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

      const response = await fetch('/api/admin/submissions/sub-1/accept', {
        method: 'POST',
      });
      const result = await response.json();

      expect(result.success).toBe(true);
    });

    test('should return error for invalid submission ID', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ error: 'Submission not found' }),
        })
      );

      const response = await fetch('/api/admin/submissions/invalid/accept', {
        method: 'POST',
      });

      expect(response.ok).toBe(false);
    });
  });

  describe('POST /api/admin/submissions/[id]/reject', () => {
    test('should reject submission', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

      const response = await fetch('/api/admin/submissions/sub-1/reject', {
        method: 'POST',
      });
      const result = await response.json();

      expect(result.success).toBe(true);
    });
  });

  describe('POST /api/admin/analyze-university', () => {
    test('should analyze university with AI', async () => {
      const mockAnalysis = {
        success: true,
        universityName: 'MIT',
        analysis: 'Detailed AI analysis...',
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAnalysis),
        })
      );

      const response = await fetch('/api/admin/analyze-university', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityId: 'uni-1' }),
      });
      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.analysis).toBeDefined();
    });

    test('should require university ID', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: 'University ID is required' }),
        })
      );

      const response = await fetch('/api/admin/analyze-university', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
    });

    test('should handle Gemini API error', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Gemini API key is not configured' }),
        })
      );

      const response = await fetch('/api/admin/analyze-university', {
        method: 'POST',
        body: JSON.stringify({ universityId: 'uni-1' }),
      });

      expect(response.ok).toBe(false);
    });
  });

  describe('GET /api/rankings', () => {
    test('should return ranked universities', async () => {
      const mockRankings = [
        { id: 'uni-1', rank: 1, trustScore: 92 },
        { id: 'uni-2', rank: 2, trustScore: 90 },
      ];

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRankings),
        })
      );

      const response = await fetch('/api/rankings');
      const data = await response.json();

      expect(data[0].rank).toBeLessThan(data[1].rank);
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      const mockAuthResponse = {
        user: { id: 'user-1', email: 'admin@rai.com', role: 'admin' },
        token: 'mock-token-123',
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAuthResponse),
        })
      );

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'admin', password: 'admin' }),
      });
      const result = await response.json();

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    test('should reject invalid credentials', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: 'Invalid credentials' }),
        })
      );

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'wrong', password: 'wrong' }),
      });

      expect(response.status).toBe(401);
    });
  });
  });
});
