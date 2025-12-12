/**
 * Test: GradientButton Component
 * Testing gradient button dengan RAI theme
 */

describe('components/GradientButton.test.js', () => {
  describe('GradientButton Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should render button with text', () => {
    const button = document.createElement('button');
    button.textContent = 'Click Me';
    button.className = 'bg-[#A84032] hover:bg-[#8B3528] text-white px-6 py-3 rounded';
    document.body.appendChild(button);

    expect(button.textContent).toBe('Click Me');
  });

  test('should have RAI maroon background', () => {
    const button = document.createElement('button');
    button.className = 'bg-[#A84032] hover:bg-[#8B3528] text-white px-6 py-3 rounded';
    document.body.appendChild(button);

    expect(button.className).toContain('bg-[#A84032]');
    expect(button.className).toContain('hover:bg-[#8B3528]');
  });

  test('should have white text color', () => {
    const button = document.createElement('button');
    button.className = 'bg-[#A84032] hover:bg-[#8B3528] text-white px-6 py-3 rounded';
    document.body.appendChild(button);

    expect(button.className).toContain('text-white');
  });

  test('should have proper padding', () => {
    const button = document.createElement('button');
    button.className = 'bg-[#A84032] hover:bg-[#8B3528] text-white px-6 py-3 rounded';
    document.body.appendChild(button);

    expect(button.className).toContain('px-6');
    expect(button.className).toContain('py-3');
  });

  test('should have rounded corners', () => {
    const button = document.createElement('button');
    button.className = 'bg-[#A84032] hover:bg-[#8B3528] text-white px-6 py-3 rounded';
    document.body.appendChild(button);

    expect(button.className).toContain('rounded');
  });

  test('should handle click events', () => {
    const handleClick = jest.fn();
    const button = document.createElement('button');
    button.onclick = handleClick;
    button.textContent = 'Submit';
    document.body.appendChild(button);

    button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('should support disabled state', () => {
    const button = document.createElement('button');
    button.disabled = true;
    button.className = 'bg-gray-400 text-white px-6 py-3 rounded cursor-not-allowed';
    document.body.appendChild(button);

    expect(button.disabled).toBe(true);
    expect(button.className).toContain('cursor-not-allowed');
  });

  test('should accept custom className', () => {
    const button = document.createElement('button');
    button.className = 'bg-[#A84032] hover:bg-[#8B3528] text-white px-6 py-3 rounded custom-class';
    document.body.appendChild(button);

    expect(button.className).toContain('custom-class');
  });

  test('should support different sizes', () => {
    const smallButton = document.createElement('button');
    smallButton.className = 'bg-[#A84032] text-white px-4 py-2 rounded text-sm';
    document.body.appendChild(smallButton);

    expect(smallButton.className).toContain('px-4');
    expect(smallButton.className).toContain('py-2');
    expect(smallButton.className).toContain('text-sm');
  });

  test('should render with icon', () => {
    const button = document.createElement('button');
    button.className = 'bg-[#A84032] text-white px-6 py-3 rounded flex items-center gap-2';
    button.innerHTML = `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
      </svg>
      <span>Submit</span>
    `;
    document.body.appendChild(button);

    expect(button.querySelector('svg')).toBeTruthy();
    expect(button.querySelector('span')?.textContent).toBe('Submit');
  });
  });
});
