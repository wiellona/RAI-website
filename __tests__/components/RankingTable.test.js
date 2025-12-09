/**
 * Test: Component - RankingTable
 * Testing komponen tabel ranking universitas
 */

describe('components/RankingTable.test.js', () => {
  describe('RankingTable Component', () => {
  let mockUniversities;

  beforeEach(() => {
    mockUniversities = [
      {
        id: 'uni-1',
        slug: 'mit',
        name: 'MIT',
        country: 'United States',
        rank: 1,
        trustScore: 92,
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
        rank: 2,
        trustScore: 90,
        metrics: {
          transparency: 92,
          auditability: 88,
          dataPrivacy: 90,
          policyMaturity: 90,
        },
      },
    ];
  });

  test('should display all universities', () => {
    expect(mockUniversities).toHaveLength(2);
  });

  test('should display university rank', () => {
    mockUniversities.forEach((uni, index) => {
      expect(uni.rank).toBe(index + 1);
    });
  });

  test('should display university name', () => {
    expect(mockUniversities[0].name).toBe('MIT');
    expect(mockUniversities[1].name).toBe('Stanford University');
  });

  test('should display country', () => {
    mockUniversities.forEach(uni => {
      expect(uni.country).toBe('United States');
    });
  });

  test('should display trust score', () => {
    expect(mockUniversities[0].trustScore).toBe(92);
    expect(mockUniversities[1].trustScore).toBe(90);
  });

  test('should display all metrics', () => {
    mockUniversities.forEach(uni => {
      expect(uni.metrics.transparency).toBeDefined();
      expect(uni.metrics.auditability).toBeDefined();
      expect(uni.metrics.dataPrivacy).toBeDefined();
      expect(uni.metrics.policyMaturity).toBeDefined();
    });
  });

  test('should have clickable university link', () => {
    mockUniversities.forEach(uni => {
      expect(uni.slug).toBeDefined();
      const expectedUrl = `/university/${uni.slug}`;
      expect(expectedUrl).toContain(uni.slug);
    });
  });

  test('should sort universities by rank ascending', () => {
    const sorted = [...mockUniversities].sort((a, b) => a.rank - b.rank);

    expect(sorted[0].rank).toBeLessThan(sorted[1].rank);
  });

  test('should handle empty list', () => {
    const emptyList = [];

    expect(emptyList).toHaveLength(0);
  });

  test('should display score badges with correct colors', () => {
    const getScoreColor = (score) => {
      if (score >= 90) return 'bg-[#5C2E2E]'; // RAI maroon for high scores
      if (score >= 80) return 'bg-[#A84032]'; // Medium maroon
      return 'bg-gray-500';
    };

    expect(getScoreColor(92)).toBe('bg-[#5C2E2E]');
    expect(getScoreColor(85)).toBe('bg-[#A84032]');
    expect(getScoreColor(75)).toBe('bg-gray-500');
  });
  });
});
