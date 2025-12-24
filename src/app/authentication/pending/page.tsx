"use client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

export interface Profile {
  id: string;
  name: string;
  role: "user" | "reviewer" | "admin";
  is_approved: boolean;
  is_rejected?: boolean;
  created_at: string;
}

export function useAuthProfile() {
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      // ✅ FIXED: Use getUser() instead of getSession()
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();
      if (ignore) return;

      setUser(authUser ?? null);

      if (authUser) {
        const { data: profileData } = await supabase
          .from("Profiles")
          .select("id,name,role,is_approved")
          .eq("id", authUser.id)
          .single();

        if (!ignore) setProfile((profileData as Profile) ?? null);
      } else {
        setProfile(null);
      }
      if (!ignore) setLoading(false);
    };

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setProfile(null);
        if (session?.user) {
          supabase
            .from("Profiles")
            .select("id,name,role,is_approved")
            .eq("id", session.user.id)
            .single()
            .then(({ data }) => setProfile((data as Profile) ?? null));
        }
      }
    );

    return () => {
      ignore = true;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, profile, loading };
}

export default function PendingApprovalPage() {
  const { user, profile, loading } = useAuthProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#e6f0ff] to-[#f0f4ff]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0047AB] mx-auto"></div>
          <p className="mt-4 text-[#000080] font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#e6f0ff] to-[#f0f4ff]">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-[#000080] mb-4">
            Not Authenticated
          </h1>
          <p className="text-[#000080]/70 mb-6">Please log in to continue.</p>
          <a
            href="/authentication/login"
            className="inline-block bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#e6f0ff] to-[#f0f4ff] p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#0047AB] to-[#0099ED] rounded-full flex items-center justify-center mx-auto mb-4">
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
          <h1 className="text-3xl font-bold text-[#000080] mb-2">
            Pending Approval
          </h1>
          <p className="text-[#000080]/70">
            Your account is awaiting administrator approval
          </p>
        </div>

        <div className="bg-gradient-to-r from-[#0047AB]/5 to-[#0099ED]/5 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#000080] mb-3">
            Account Details
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#000080]/70">Name:</span>
              <span className="font-semibold text-[#000080]">
                {profile?.name || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#000080]/70">Email:</span>
              <span className="font-semibold text-[#000080]">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#000080]/70">Status:</span>
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                Pending
              </span>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-[#0047AB] bg-[#f0f4ff] p-4 rounded-r-lg mb-6">
          <p className="text-[#000080]/80 text-sm leading-relaxed">
            <strong className="text-[#000080]">What happens next?</strong>
            <br />
            An administrator will review your registration. Once approved,
            you'll be able to access all features of the platform. You'll
            receive an email notification when your account is approved.
          </p>
        </div>

        <div className="flex gap-4">
          <a
            href="/"
            className="flex-1 text-center bg-white border-2 border-[#0047AB] text-[#0047AB] font-semibold px-6 py-3 rounded-lg hover:bg-[#f0f4ff] transition-all duration-300"
          >
            Go to Home
          </a>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}
