"use client";

import { useAuth } from '@/app/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Container from '../Container';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    // ✅ Jika loading selesai
    if (!loading) {
      if (!user || profile?.role !== 'admin') {
        // Redirect jika tidak authorized
        router.replace('/authentication/login');
      } else {
        // Authorized - tampilkan dashboard
        setCanShow(true);
      }
    }
  }, [loading, user, profile, router]);

  // ✅ Timeout fallback - jika loading lebih dari 3 detik, paksa tampilkan
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && user && profile?.role === 'admin') {
        console.log('[AdminGuard] Force show - loading too long');
        setCanShow(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [loading, user, profile]);

  // Show loading maksimal 3 detik
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

  // Jika sudah bisa show atau loading > 3 detik
  if (canShow) {
    return <>{children}</>;
  }

  return null;
}
