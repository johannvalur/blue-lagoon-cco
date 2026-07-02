'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn && pathname !== '/login') {
      router.push('/login');
    }
  }, [isLoggedIn, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-bluelagoon-blue-800 via-bluelagoon-blue-700 to-bluelagoon-blue-900">
        <div className="text-bluelagoon-water-100">Loading...</div>
      </div>
    );
  }

  if (pathname === '/login') {
    return children;
  }

  if (!isLoggedIn) {
    return null;
  }

  return children;
}
