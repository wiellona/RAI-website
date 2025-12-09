# Testing Suite Documentation

## 📋 Overview

Comprehensive testing suite untuk RAI (Responsible AI) Website yang mencakup:
- **Pages Testing**: Home, Admin Dashboard, University Detail
- **Components Testing**: FilterBar, RankingTable, NavBar, Footer, ScoreBadge, GradientButton, Container
- **API Testing**: Semua endpoints (universities, submissions, auth, rankings)
- **Context Testing**: AuthContext untuk authentication
- **Library Testing**: API utility functions

## 🏗️ Struktur Testing

```
__tests__/
├── setup.js                          # Jest configuration & mocks
├── pages/
│   ├── home.test.js                  # Home page tests (9 tests)
│   ├── admin.test.js                 # Admin dashboard tests (20+ tests)
│   └── university-detail.test.js     # University detail page tests (10 tests)
├── components/
│   ├── FilterBar.test.js             # Filter functionality tests
│   ├── RankingTable.test.js          # Table display tests
│   ├── NavBar.test.js                # Navigation bar tests
│   ├── Footer.test.js                # Footer tests
│   ├── ScoreBadge.test.js            # Score badge color coding tests
│   ├── GradientButton.test.js        # Button component tests
│   └── Container.test.js             # Layout container tests
├── api/
│   └── routes.test.js                # API endpoints tests
├── context/
│   └── AuthContext.test.js           # Authentication context tests
└── lib/
    └── api.test.js                   # API utility functions tests
```

## 🧪 Test Coverage

### Pages (3 files, 39+ tests)
- **home.test.js**: Loading, filtering (region/country/score), search, sorting, empty states, error handling
- **admin.test.js**: Submissions management, user management, rankings, AI analysis, authorization
- **university-detail.test.js**: Load by slug, display metrics, handle 404, RAI theme validation

### Components (7 files, 50+ tests)
- **FilterBar.test.js**: Region filters, country filters, score filters, search, reset functionality
- **RankingTable.test.js**: Display universities, sorting, RAI theme colors, empty states
- **NavBar.test.js**: Logo, navigation links, admin access, RAI colors, auth state
- **Footer.test.js**: Copyright, social links, contact info, RAI background
- **ScoreBadge.test.js**: Color coding (green/blue/yellow/red), score thresholds
- **GradientButton.test.js**: RAI colors, click events, disabled state, sizes, icons
- **Container.test.js**: Layout, responsive padding, centering, custom classes

### API Routes (1 file, 20+ tests)
- Universities: GET all, GET by slug, 404 handling
- Submissions: GET, accept, reject, authorization
- Rankings: GET, update scores
- Auth: Login success/failure
- AI Analysis: Analyze university metrics

### Context & Lib (2 files, 15+ tests)
- **AuthContext.test.js**: Login/logout, token persistence, role-based access
- **api.test.js**: All API utility functions, localStorage handling, error handling

## 🚀 Installation

Install testing dependencies:

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

## ▶️ Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test __tests__/pages/home.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should filter"
```

## 📊 Coverage Thresholds

Configured dalam `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

## 🎨 RAI Theme Testing

Semua tests memvalidasi RAI color scheme:
- **Primary Maroon**: `#5C2E2E` (dark maroon)
- **Accent Maroon**: `#A84032` (medium maroon)
- **Hover State**: `#8B3528` (dark hover)
- **Background**: `#FAF9F6` (cream)

Example dari test:

```javascript
test('should use RAI maroon colors', () => {
  expect(element.className).toContain('bg-[#5C2E2E]');
  expect(element.className).toContain('text-white');
});
```

## 🔧 Jest Configuration

**jest.config.js** features:
- Next.js integration dengan `next/jest`
- Module aliases (`@/components`, `@/lib`, etc.)
- JSDOM environment untuk DOM testing
- Coverage collection dari `src/**` files
- Ignore patterns untuk `node_modules`, `.next`, `out`

**setup.js** mocks:
- Environment variables (NEXT_PUBLIC_SUPABASE_URL, etc.)
- localStorage (getItem, setItem, removeItem)
- fetch API untuk HTTP requests
- Supabase client mocks

## 📝 Test Structure

Setiap test file mengikuti pattern:

```javascript
describe('Component/Page Name', () => {
  beforeEach(() => {
    // Setup before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
  });

  test('should do something', () => {
    // Arrange
    const mockData = { ... };
    
    // Act
    const result = someFunction(mockData);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

## 🐛 Debugging Tests

```bash
# Run with verbose output
npm test -- --verbose

# Run with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Run single test in debug mode
npm test -- --testNamePattern="specific test" --runInBand
```

## ✅ Best Practices

1. **Mock External Dependencies**: Semua API calls, localStorage, Supabase
2. **Test User Interactions**: Clicks, form submissions, navigation
3. **Validate RAI Theme**: Semua colors harus match brand guidelines
4. **Test Error States**: Handle API errors, 404s, validation errors
5. **Test Authorization**: Admin-only routes, protected endpoints
6. **Use Descriptive Names**: `should filter universities by region` lebih baik dari `test 1`
7. **Clean Up**: Always clear mocks di `afterEach`
8. **Test Edge Cases**: Empty arrays, null values, boundary conditions

## 📈 Next Steps

1. **Integration Tests**: Full user flows (login → submit → approve)
2. **E2E Tests**: Dengan Playwright/Cypress
3. **Performance Tests**: Load testing untuk API endpoints
4. **Accessibility Tests**: WCAG compliance testing
5. **Visual Regression**: Screenshot comparison tests

## 🔗 Related Documentation

- [BACKEND_GUIDE.md](../backend/BACKEND_GUIDE.md) - Backend implementation
- [SUBMISSION_FLOW.md](../SUBMISSION_FLOW.md) - Submission workflow
- [SUPABASE_IMPLEMENTATION.md](../SUPABASE_IMPLEMENTATION.md) - Database setup

## 📞 Support

Untuk issues atau questions tentang testing:
1. Check test output untuk error messages
2. Review mock data di `setup.js`
3. Verify API endpoints di `routes.test.js`
4. Check component props di component tests
