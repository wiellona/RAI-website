"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthProfile } from "@/hooks/useAuthProfile";

export default function PendingApprovalPage() {
  const { user, profile, loading } = useAuthProfile();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/authentication/login");
      return;
    }

    if (profile?.is_approved) {
      router.push("/");
      return;
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF9F6] to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6B2C2C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B2C2C] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF9F6] to-white px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border-2 border-[#6B2C2C]/20">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#C19A6B] to-[#8B7355] rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-[#6B2C2C] mb-4">
            Pending Approval
          </h1>

          <p className="text-gray-600 mb-6">
            Your account is currently awaiting approval from an administrator.
          </p>

          <div className="bg-[#C19A6B]/10 border-2 border-[#C19A6B]/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Account Email:</strong> {user?.email}
            </p>
            {profile?.name && (
              <p className="text-sm text-gray-700 mt-2">
                <strong>Name:</strong> {profile.name}
              </p>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-6">
            You will receive an email notification once your account has been
            approved.
          </p>

          <button
            onClick={() => router.push("/authentication/login")}
            className="w-full bg-gradient-to-r from-[#6B2C2C] to-[#8B4513] hover:from-[#8B4513] hover:to-[#6B2C2C] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
