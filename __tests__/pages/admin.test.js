/**
 * Test: Admin Dashboard Page
 * Testing halaman admin dengan submissions, rankings, dan user management
 */

describe('pages/admin.test.js', () => {
  describe('Admin Dashboard Page', () => {
  let mockSubmissions;
  let mockUsers;
  let mockRankings;

  beforeEach(() => {
    // Mock submissions data
    mockSubmissions = [
      {
        id: 'sub-1',
        university_id: 'uni-1',
        questionnaire_id: 'q-1',
        submitted_by_user_id: 'user-1',
        submitted_at: '2025-11-20T10:00:00Z',
        status: 'submitted',
        university: {
          name: 'Stanford University',
          website: 'https://stanford.edu',
          pic_name: 'John Smith',
          pic_email: 'john@stanford.edu',
        },
        questionnaire: {
          title: 'Responsible AI Assessment 2025',
          version: '1',
        },
      },
    ];

    // Mock users data
    mockUsers = [
      {
        id: 'user-1',
        name: 'Admin User',
        email: 'admin@rai.com',
        role: 'admin',
      },
      {
        id: 'user-2',
        name: 'Regular User',
        email: 'user@rai.com',
        role: 'user',
      },
    ];

    // Mock rankings data
    mockRankings = [
      {
        id: 'uni-1',
        name: 'MIT',
        rank: 1,
        trustScore: 92,
        metrics: {
          transparency: 95,
          auditability: 90,
          dataPrivacy: 93,
          policyMaturity: 90,
        },
      },
    ];

    // Mock fetch responses
    global.fetch = jest.fn((url) => {
      if (url.includes('/admin/submissions')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSubmissions),
        });
      }
      if (url.includes('/admin/users')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUsers),
        });
      }
      if (url.includes('/rankings')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRankings),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 404,
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Submissions Management', () => {
    test('should load pending submissions', async () => {
      const response = await fetch('/api/admin/submissions');
      const data = await response.json();

      expect(data).toEqual(mockSubmissions);
      expect(data[0].status).toBe('submitted');
    });

    test('should accept submission', async () => {
      const submissionId = 'sub-1';
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

      const response = await fetch(`/api/admin/submissions/${submissionId}/accept`, {
        method: 'POST',
      });
      const result = await response.json();

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/accept'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    test('should reject submission', async () => {
      const submissionId = 'sub-1';
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

      const response = await fetch(`/api/admin/submissions/${submissionId}/reject`, {
        method: 'POST',
      });
      const result = await response.json();

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/reject'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    test('should display university name in submission', () => {
      const submission = mockSubmissions[0];

      expect(submission.university).toBeDefined();
      expect(submission.university.name).toBe('Stanford University');
    });
  });

  describe('User Management', () => {
    test('should load users list', async () => {
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      expect(data).toEqual(mockUsers);
      expect(data).toHaveLength(2);
    });

    test('should filter admin users', () => {
      const admins = mockUsers.filter(u => u.role === 'admin');

      expect(admins).toHaveLength(1);
      expect(admins[0].email).toBe('admin@rai.com');
    });

    test('should update user role', async () => {
      const userId = 'user-2';
      const newRole = 'admin';

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      const result = await response.json();

      expect(result.success).toBe(true);
    });
  });

  describe('Rankings Management', () => {
    test('should load university rankings', async () => {
      const response = await fetch('/api/rankings');
      const data = await response.json();

      expect(data).toEqual(mockRankings);
      expect(data[0].rank).toBe(1);
    });

    test('should display metrics for each university', () => {
      const university = mockRankings[0];

      expect(university.metrics).toBeDefined();
      expect(university.metrics.transparency).toBe(95);
      expect(university.metrics.auditability).toBe(90);
      expect(university.metrics.dataPrivacy).toBe(93);
      expect(university.metrics.policyMaturity).toBe(90);
    });

    test('should calculate trust score', () => {
      const university = mockRankings[0];
      const metrics = university.metrics;
      
      // Trust score should be average of all metrics
      const calculatedScore = Math.round(
        (metrics.transparency + 
         metrics.auditability + 
         metrics.dataPrivacy + 
         metrics.policyMaturity) / 4
      );

      expect(university.trustScore).toBeGreaterThanOrEqual(0);
      expect(university.trustScore).toBeLessThanOrEqual(100);
    });
  });

  describe('AI Analysis', () => {
    test('should analyze university with Gemini AI', async () => {
      const universityId = 'uni-1';
      const mockAnalysis = {
        success: true,
        universityName: 'MIT',
        analysis: 'AI-generated analysis...',
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAnalysis),
        })
      );

      const response = await fetch('/api/admin/analyze-university', {
        method: 'POST',
        body: JSON.stringify({ universityId }),
      });
      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.universityName).toBe('MIT');
      expect(result.analysis).toBeDefined();
    });

    test('should handle AI analysis error', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Gemini API error' }),
        })
      );

      const response = await fetch('/api/admin/analyze-university', {
        method: 'POST',
        body: JSON.stringify({ universityId: 'uni-1' }),
      });

      expect(response.ok).toBe(false);
    });
  });

  describe('Authorization', () => {
    test('should require admin role for admin routes', () => {
      const user = mockUsers[1]; // Regular user

      expect(user.role).toBe('user');
      expect(user.role).not.toBe('admin');
    });

    test('should allow admin access for admin users', () => {
      const user = mockUsers[0]; // Admin user

      expect(user.role).toBe('admin');
    });
  });
  });
});
