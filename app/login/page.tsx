'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (login(username, password)) {
      window.location.href = `${BASE}/strategy`;
    } else {
      setError('Invalid credentials');
      setPassword('');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-bluelagoon-blue-800 via-bluelagoon-blue-700 to-bluelagoon-blue-900">
      <div className="w-full max-w-sm">
        <div className="rounded-lg bg-white/10 backdrop-blur-sm p-8 shadow-2xl border border-white/20">
          <h1 className="text-center text-3xl font-bold text-bluelagoon-water-100 mb-8">
            Blue Lagoon
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-bluelagoon-water-200 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition disabled:opacity-50"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-bluelagoon-water-200 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition disabled:opacity-50"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-bluelagoon-moss-600 hover:bg-bluelagoon-moss-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded transition"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
