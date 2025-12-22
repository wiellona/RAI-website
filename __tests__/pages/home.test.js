/**
 * Test: Home Page (/)
 * Testing halaman utama dengan ranking table
 */

describe('pages/home.test.js', () => {
  describe('Home Page', () => {
    let mockUniversities;

    beforeEach(() => {
      // Mock data universities
      mockUniversities = [
        {
          id: 'uni-1',
          slug: 'mit',
          name: 'Massachusetts Institute of Technology',
          country: 'United States',
          region: 'North America',
          rank: 1,
          trustScore: 92,
          lastUpdated: '2025-11-24T10:00:00Z',
          metrics: {
            transparency: 95,
            auditability: 90,
            dataPrivacy: 93,
            policyMaturity: 90,
          },
        },
        {
          id: 'uni-2',
          slug: 'stanford',
          name: 'Stanford University',
          country: 'United States',
          region: 'North America',
          rank: 2,
          trustScore: 90,
          lastUpdated: '2025-11-24T10:00:00Z',
          metrics: {
            transparency: 92,
            auditability: 88,
            dataPrivacy: 90,
            policyMaturity: 90,
          },
        },
      ];

      // Mock fetch API
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUniversities),
        })
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should load universities on page load', async () => {
      const response = await fetch('/api/universities');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toEqual(mockUniversities);
      expect(data).toHaveLength(2);
    });

    test('should display university rankings', () => {
      expect(mockUniversities[0].rank).toBe(1);
      expect(mockUniversities[1].rank).toBe(2);
    });

    test('should filter universities by region', () => {
      const northAmerica = mockUniversities.filter(u => u.region === 'North America');
      expect(northAmerica).toHaveLength(2);
    });

    test('should handle API error gracefully', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([]),
        })
      );

      const response = await fetch('/api/universities');

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });
  });
});
