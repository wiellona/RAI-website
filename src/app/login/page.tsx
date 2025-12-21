"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();

  useEffect(() => {
    // ✅ FIXED: Redirect to the proper login page immediately
    router.replace("/authentication/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#6B2C2C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#6B2C2C]">Redirecting to login...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
