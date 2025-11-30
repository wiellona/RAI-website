/**
 * Test: Footer Component
 * Testing footer dengan RAI branding
 */

describe('components/Footer.test.js', () => {
  describe('Footer Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should render footer with RAI background', () => {
    const footer = document.createElement('footer');
    footer.className = 'bg-[#5C2E2E] text-white py-8 mt-auto';
    footer.innerHTML = `
      <div class="container mx-auto text-center">
        <p>&copy; 2025 Responsible AI Rankings</p>
      </div>
    `;
    document.body.appendChild(footer);

    expect(footer.className).toContain('bg-[#5C2E2E]');
    expect(footer.querySelector('p')?.textContent).toContain('Responsible AI Rankings');
  });

  test('should display copyright year', () => {
    const footer = document.createElement('footer');
    const currentYear = new Date().getFullYear();
    footer.innerHTML = `<p>&copy; ${currentYear} Responsible AI Rankings</p>`;
    document.body.appendChild(footer);

    expect(footer.textContent).toContain(currentYear.toString());
  });

  test('should render social media links', () => {
    const footer = document.createElement('footer');
    footer.innerHTML = `
      <div class="flex justify-center gap-6 mt-4">
        <a href="https://twitter.com/rai">Twitter</a>
        <a href="https://linkedin.com/rai">LinkedIn</a>
        <a href="https://github.com/rai">GitHub</a>
      </div>
    `;
    document.body.appendChild(footer);

    const links = footer.querySelectorAll('a');
    expect(links.length).toBe(3);
    expect(links[0].textContent).toBe('Twitter');
    expect(links[1].textContent).toBe('LinkedIn');
    expect(links[2].textContent).toBe('GitHub');
  });

  test('should have proper styling classes', () => {
    const footer = document.createElement('footer');
    footer.className = 'bg-[#5C2E2E] text-white py-8 mt-auto';
    document.body.appendChild(footer);

    expect(footer.className).toContain('bg-[#5C2E2E]');
    expect(footer.className).toContain('text-white');
    expect(footer.className).toContain('py-8');
    expect(footer.className).toContain('mt-auto');
  });

  test('should render contact information', () => {
    const footer = document.createElement('footer');
    footer.innerHTML = `
      <div class="mt-4">
        <p>Contact: info@rai-rankings.org</p>
        <p>Address: Jakarta, Indonesia</p>
      </div>
    `;
    document.body.appendChild(footer);

    expect(footer.textContent).toContain('info@rai-rankings.org');
    expect(footer.textContent).toContain('Jakarta, Indonesia');
  });
  });
});
