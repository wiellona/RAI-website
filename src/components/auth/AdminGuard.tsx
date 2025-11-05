"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Container from '../Container';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <Container>
        <div className="text-center py-16">
          <h1 className="text-2xl font-semibold">Verifying access...</h1>
          <p>You must be an admin to view this page.</p>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
}
