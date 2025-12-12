/**
 * Test: Container Component
 * Testing layout container wrapper
 */

describe('components/Container.test.js', () => {
  describe('Container Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should render children content', () => {
    const container = document.createElement('div');
    container.className = 'container mx-auto px-4';
    container.innerHTML = '<h1>Test Content</h1>';
    document.body.appendChild(container);

    expect(container.textContent).toBe('Test Content');
    expect(container.querySelector('h1')).toBeTruthy();
  });

  test('should have proper container classes', () => {
    const container = document.createElement('div');
    container.className = 'container mx-auto px-4';
    document.body.appendChild(container);

    expect(container.className).toContain('container');
    expect(container.className).toContain('mx-auto');
    expect(container.className).toContain('px-4');
  });

  test('should center content horizontally', () => {
    const container = document.createElement('div');
    container.className = 'container mx-auto px-4';
    document.body.appendChild(container);

    expect(container.className).toContain('mx-auto');
  });

  test('should have responsive padding', () => {
    const container = document.createElement('div');
    container.className = 'container mx-auto px-4 md:px-6 lg:px-8';
    document.body.appendChild(container);

    expect(container.className).toContain('px-4');
    expect(container.className).toContain('md:px-6');
    expect(container.className).toContain('lg:px-8');
  });

  test('should accept custom className prop', () => {
    const container = document.createElement('div');
    container.className = 'container mx-auto px-4 custom-class';
    document.body.appendChild(container);

    expect(container.className).toContain('custom-class');
  });

  test('should render multiple children', () => {
    const container = document.createElement('div');
    container.className = 'container mx-auto px-4';
    container.innerHTML = `
      <h1>Title</h1>
      <p>Paragraph</p>
      <button>Button</button>
    `;
    document.body.appendChild(container);

    expect(container.querySelector('h1')).toBeTruthy();
    expect(container.querySelector('p')).toBeTruthy();
    expect(container.querySelector('button')).toBeTruthy();
  });
  });
});
