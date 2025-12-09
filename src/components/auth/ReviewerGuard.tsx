"use client";

import { useAuth } from '@/app/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Container from '../Container';

export default function ReviewerGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || profile?.role !== 'reviewer') {
        router.replace('/authentication/login');
      } else {
        setCanShow(true);
      }
    }
  }, [loading, user, profile, router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && user && profile?.role === 'reviewer') {
        setCanShow(true);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [loading, user, profile]);

  if (!canShow && loading) {
    return (
      <Container>
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-[#6B2C2C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold text-[#6B2C2C]">Loading...</h1>
        </div>
      </Container>
    );
  }

  if (canShow) {
    return <>{children}</>;
  }

  return null;
}
