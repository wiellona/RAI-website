"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Container from "@/components/Container";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user) {
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
