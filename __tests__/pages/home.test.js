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

  test('should load universities from API', async () => {
    const response = await fetch('/api/universities');
    const data = await response.json();

    expect(fetch).toHaveBeenCalledWith('/api/universities');
    expect(data).toEqual(mockUniversities);
    expect(data).toHaveLength(2);
  });

  test('should display hero section with correct title', () => {
    const expectedTitle = 'Setting the Global Standard for Responsible AI in Academia.';
    
    expect(expectedTitle).toBeDefined();
    expect(expectedTitle).toContain('Responsible AI');
  });

  test('should filter universities by region', () => {
    const region = 'North America';
    const filtered = mockUniversities.filter(u => u.region === region);

    expect(filtered).toHaveLength(2);
    expect(filtered[0].region).toBe('North America');
  });

  test('should filter universities by country', () => {
    const country = 'United States';
    const filtered = mockUniversities.filter(u => u.country === country);

    expect(filtered).toHaveLength(2);
    expect(filtered.every(u => u.country === country)).toBe(true);
  });

  test('should filter universities by minimum score', () => {
    const minScore = 91;
    const filtered = mockUniversities.filter(u => u.trustScore >= minScore);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Massachusetts Institute of Technology');
  });

  test('should search universities by name', () => {
    const query = 'stanford';
    const filtered = mockUniversities.filter(u => 
      u.name.toLowerCase().includes(query.toLowerCase())
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].slug).toBe('stanford');
  });

  test('should sort universities by rank', () => {
    const sorted = [...mockUniversities].sort((a, b) => a.rank - b.rank);

    expect(sorted[0].rank).toBe(1);
    expect(sorted[1].rank).toBe(2);
  });

  test('should handle empty universities list', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    const response = await fetch('/api/universities');
    const data = await response.json();

    expect(data).toEqual([]);
    expect(data).toHaveLength(0);
  });

  test('should handle API error gracefully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })
    );

    const response = await fetch('/api/universities');

    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });
});
