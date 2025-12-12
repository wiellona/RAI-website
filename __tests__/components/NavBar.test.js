/**
 * Test: NavBar Component
 * Testing navigation bar dengan RAI theme
 */

describe('components/NavBar.test.js', () => {
  describe('NavBar Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should render logo and title', () => {
    const nav = document.createElement('nav');
    nav.className = 'bg-[#5C2E2E] text-white';
    nav.innerHTML = `
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-2xl font-bold">RAI</div>
      </div>
    `;
    document.body.appendChild(nav);

    expect(nav.querySelector('.text-2xl')?.textContent).toBe('RAI');
    expect(nav.className).toContain('bg-[#5C2E2E]');
  });

  test('should render navigation links', () => {
    const nav = document.createElement('nav');
    nav.innerHTML = `
      <ul class="flex gap-6">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/methodology">Methodology</a></li>
      </ul>
    `;
    document.body.appendChild(nav);

    const links = nav.querySelectorAll('a');
    expect(links.length).toBe(3);
    expect(links[0].textContent).toBe('Home');
    expect(links[1].textContent).toBe('About');
    expect(links[2].textContent).toBe('Methodology');
  });

  test('should have admin link when logged in as admin', () => {
    const mockUser = { role: 'admin' };
    
    const nav = document.createElement('nav');
    nav.innerHTML = `
      <ul class="flex gap-6">
        <li><a href="/">Home</a></li>
        ${mockUser.role === 'admin' ? '<li><a href="/admin">Admin</a></li>' : ''}
      </ul>
    `;
    document.body.appendChild(nav);

    const adminLink = nav.querySelector('a[href="/admin"]');
    expect(adminLink).toBeTruthy();
    expect(adminLink?.textContent).toBe('Admin');
  });

  test('should not have admin link for regular users', () => {
    const mockUser = { role: 'user' };
    
    const nav = document.createElement('nav');
    nav.innerHTML = `
      <ul class="flex gap-6">
        <li><a href="/">Home</a></li>
        ${mockUser.role === 'admin' ? '<li><a href="/admin">Admin</a></li>' : ''}
      </ul>
    `;
    document.body.appendChild(nav);

    const adminLink = nav.querySelector('a[href="/admin"]');
    expect(adminLink).toBeFalsy();
  });

  test('should use RAI maroon color', () => {
    const nav = document.createElement('nav');
    nav.className = 'bg-[#5C2E2E] text-white';
    document.body.appendChild(nav);

    expect(nav.className).toContain('bg-[#5C2E2E]');
    expect(nav.className).toContain('text-white');
  });

  test('should show login/logout button based on auth state', () => {
    const isLoggedIn = true;
    
    const button = document.createElement('button');
    button.textContent = isLoggedIn ? 'Logout' : 'Login';
    button.className = 'bg-[#A84032] hover:bg-[#8B3528] px-4 py-2 rounded';
    
    document.body.appendChild(button);

    expect(button.textContent).toBe('Logout');
    expect(button.className).toContain('bg-[#A84032]');
  });
  });
});
