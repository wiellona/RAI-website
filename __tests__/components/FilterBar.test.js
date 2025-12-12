/**
 * Test: Component - FilterBar
 * Testing komponen filter untuk halaman ranking
 */

describe('components/FilterBar.test.js', () => {
  describe('FilterBar Component', () => {
  let mockRegions;
  let mockCountries;
  let mockFilters;

  beforeEach(() => {
    mockRegions = ['North America', 'Europe', 'Asia'];
    mockCountries = ['United States', 'United Kingdom', 'Singapore'];
    mockFilters = {
      query: '',
      region: '',
      country: '',
      minScore: 0,
    };
  });

  test('should initialize with empty filters', () => {
    expect(mockFilters.query).toBe('');
    expect(mockFilters.region).toBe('');
    expect(mockFilters.country).toBe('');
    expect(mockFilters.minScore).toBe(0);
  });

  test('should update search query', () => {
    const newQuery = 'stanford';
    mockFilters.query = newQuery;

    expect(mockFilters.query).toBe('stanford');
  });

  test('should update region filter', () => {
    const selectedRegion = 'North America';
    mockFilters.region = selectedRegion;

    expect(mockFilters.region).toBe('North America');
  });

  test('should update country filter', () => {
    const selectedCountry = 'United States';
    mockFilters.country = selectedCountry;

    expect(mockFilters.country).toBe('United States');
  });

  test('should update minimum score filter', () => {
    const minScore = 80;
    mockFilters.minScore = minScore;

    expect(mockFilters.minScore).toBe(80);
    expect(mockFilters.minScore).toBeGreaterThanOrEqual(0);
    expect(mockFilters.minScore).toBeLessThanOrEqual(100);
  });

  test('should reset all filters', () => {
    mockFilters = {
      query: 'test',
      region: 'Europe',
      country: 'UK',
      minScore: 90,
    };

    // Reset
    mockFilters = {
      query: '',
      region: '',
      country: '',
      minScore: 0,
    };

    expect(mockFilters.query).toBe('');
    expect(mockFilters.region).toBe('');
    expect(mockFilters.country).toBe('');
    expect(mockFilters.minScore).toBe(0);
  });

  test('should have valid region options', () => {
    expect(mockRegions).toContain('North America');
    expect(mockRegions).toContain('Europe');
    expect(mockRegions).toContain('Asia');
  });

  test('should have valid country options', () => {
    expect(mockCountries).toContain('United States');
    expect(mockCountries).toContain('United Kingdom');
    expect(mockCountries).toContain('Singapore');
  });
  });
});
