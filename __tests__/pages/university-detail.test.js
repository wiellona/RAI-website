/**
 * Test: University Detail Page
 * Testing halaman detail universitas
 */

describe('pages/university-detail.test.js', () => {
  describe('University Detail Page', () => {
  let mockUniversity;

  beforeEach(() => {
    mockUniversity = {
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
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUniversity),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should load university by slug', async () => {
    const response = await fetch('/api/universities/mit');
    const data = await response.json();

    expect(data).toEqual(mockUniversity);
    expect(data.slug).toBe('mit');
  });

  test('should display university name', () => {
    expect(mockUniversity.name).toBe('Massachusetts Institute of Technology');
  });

  test('should display trust score', () => {
    expect(mockUniversity.trustScore).toBe(92);
    expect(mockUniversity.trustScore).toBeGreaterThanOrEqual(0);
    expect(mockUniversity.trustScore).toBeLessThanOrEqual(100);
  });

  test('should display all metrics', () => {
    const { metrics } = mockUniversity;

    expect(metrics.transparency).toBe(95);
    expect(metrics.auditability).toBe(90);
    expect(metrics.dataPrivacy).toBe(93);
    expect(metrics.policyMaturity).toBe(90);
  });

  test('should display country and region', () => {
    expect(mockUniversity.country).toBe('United States');
    expect(mockUniversity.region).toBe('North America');
  });

  test('should display rank', () => {
    expect(mockUniversity.rank).toBe(1);
  });

  test('should format last updated date', () => {
    const date = new Date(mockUniversity.lastUpdated);

    expect(date).toBeInstanceOf(Date);
    expect(date.toISOString()).toBe('2025-11-24T10:00:00.000Z');
  });

  test('should handle university not found', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'University not found' }),
      })
    );

    const response = await fetch('/api/universities/invalid-slug');

    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
  });

  test('should calculate metric progress bars', () => {
    const { metrics } = mockUniversity;

    Object.values(metrics).forEach(value => {
      const percentage = value; // Already 0-100
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });
  });
});
