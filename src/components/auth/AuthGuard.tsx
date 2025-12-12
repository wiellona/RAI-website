"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider"; // ✅ Fixed import
import Container from "@/components/Container";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(); // ✅ Changed from isLoading to loading
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <Container>
        <div className="text-center py-16">
          <h1 className="text-2xl font-semibold">Redirecting to login…</h1>
          <p>You must be logged in to view this page.</p>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
}
