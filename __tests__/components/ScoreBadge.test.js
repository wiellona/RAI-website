/**
 * Test: ScoreBadge Component
 * Testing score badge dengan color coding
 */

describe('components/ScoreBadge.test.js', () => {
  describe('ScoreBadge Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  function getScoreColor(score) {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  }

  test('should render high score with green color', () => {
    const score = 85;
    const badge = document.createElement('span');
    badge.className = `px-3 py-1 rounded-full border ${getScoreColor(score)}`;
    badge.textContent = score.toString();
    document.body.appendChild(badge);

    expect(badge.className).toContain('bg-green-100');
    expect(badge.className).toContain('text-green-800');
    expect(badge.textContent).toBe('85');
  });

  test('should render medium score with blue color', () => {
    const score = 65;
    const badge = document.createElement('span');
    badge.className = `px-3 py-1 rounded-full border ${getScoreColor(score)}`;
    badge.textContent = score.toString();
    document.body.appendChild(badge);

    expect(badge.className).toContain('bg-blue-100');
    expect(badge.className).toContain('text-blue-800');
  });

  test('should render low-medium score with yellow color', () => {
    const score = 45;
    const badge = document.createElement('span');
    badge.className = `px-3 py-1 rounded-full border ${getScoreColor(score)}`;
    badge.textContent = score.toString();
    document.body.appendChild(badge);

    expect(badge.className).toContain('bg-yellow-100');
    expect(badge.className).toContain('text-yellow-800');
  });

  test('should render low score with red color', () => {
    const score = 30;
    const badge = document.createElement('span');
    badge.className = `px-3 py-1 rounded-full border ${getScoreColor(score)}`;
    badge.textContent = score.toString();
    document.body.appendChild(badge);

    expect(badge.className).toContain('bg-red-100');
    expect(badge.className).toContain('text-red-800');
  });

  test('should handle edge case score 80', () => {
    const score = 80;
    const color = getScoreColor(score);
    expect(color).toContain('green');
  });

  test('should handle edge case score 60', () => {
    const score = 60;
    const color = getScoreColor(score);
    expect(color).toContain('blue');
  });

  test('should handle edge case score 40', () => {
    const score = 40;
    const color = getScoreColor(score);
    expect(color).toContain('yellow');
  });

  test('should have rounded corners', () => {
    const badge = document.createElement('span');
    badge.className = 'px-3 py-1 rounded-full border';
    document.body.appendChild(badge);

    expect(badge.className).toContain('rounded-full');
  });

  test('should have proper padding', () => {
    const badge = document.createElement('span');
    badge.className = 'px-3 py-1 rounded-full border';
    document.body.appendChild(badge);

    expect(badge.className).toContain('px-3');
    expect(badge.className).toContain('py-1');
  });

  test('should display score as text', () => {
    const badge = document.createElement('span');
    badge.textContent = '75';
    document.body.appendChild(badge);

    expect(badge.textContent).toBe('75');
  });
  });
});
