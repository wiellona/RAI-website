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
    <div className="bg-[#FAF9F6] min-h-screen py-16">
      <Container>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-center mb-6 text-[#5C2E2E]">Login to RAI</h1>
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
                className="w-full bg-[#A84032] hover:bg-[#8B3528] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                disabled={auth.isLoading}
              >
                {auth.isLoading ? 'Logging in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
