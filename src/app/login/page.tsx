"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@/components/Container';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await auth.login(username, password);

    if (success) {
      const next = searchParams.get('next');
      if (next) {
        router.push(next);
      } else if (username === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <Container>
      <div className="flex justify-center items-center py-16">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={auth.isLoading}
              >
                {auth.isLoading ? 'Logging in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
