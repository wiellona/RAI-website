"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Header";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { error: authError, data } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (authError) throw authError;

      localStorage.setItem("userEmail", normalizedEmail);

      // Fetch user profile to get role
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("Profiles")
          .select("id,name,role,is_approved")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          // Default redirect if profile fetch fails
          router.push("/questionnaire/general-info");
          return;
        }

        // Redirect based on role
        if (profileData?.role === "admin") {
          router.push("/admin");
        } else if (profileData?.role === "reviewer") {
          router.push("/reviewer");
        } else {
          // Default redirect for university/user role
          router.push("/questionnaire/general-info");
        }
      } else {
        router.push("/questionnaire/general-info");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-white via-[#f0f4ff] to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-[#0047AB]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#0099ED]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md">
          {/* RAI Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-[#000080] to-[#0047AB] bg-clip-text text-transparent mb-12">
            RAI
          </h1>

          {/* Login Form Card */}
          <div className="bg-gradient-to-br from-white via-[#f8f9ff] to-white border-2 border-[#0047AB]/20 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-[#000080] mb-6">
              University Portal Login
            </h2>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#000080] mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full px-4 py-3 border-2 border-[#0047AB]/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0047AB]/20 focus:border-[#0047AB] transition-all duration-300 bg-gradient-to-r from-white to-[#f8f9ff]"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#000080] mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-[#0047AB]/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0047AB]/20 focus:border-[#0047AB] transition-all duration-300 bg-gradient-to-r from-white to-[#f8f9ff]"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-xl shadow-[#0047AB]/30 hover:shadow-2xl hover:shadow-[#0047AB]/40 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              {/* Links */}
              <div className="flex justify-between items-center pt-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#0047AB] hover:text-[#0099ED] transition-colors duration-300 font-semibold"
                >
                  Forgot Password?
                </Link>
                <Link
                  href="/authentication/register"
                  className="text-sm text-[#0047AB] hover:text-[#0099ED] transition-colors duration-300 font-semibold"
                >
                  Register your University
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#000080] text-white py-8 border-t-4 border-[#0099ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            {/* Logo and Description */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#0047AB] to-[#0099ED] rounded-lg shadow-lg"></div>
                <span className="text-xl font-bold">RAI</span>
              </div>
              <p className="text-sm text-white/90 font-medium">
                Responsible AI Global University Ranking
              </p>
            </div>

            {/* Contact and Social Links */}
            <div className="flex flex-col space-y-2">
              <p className="text-sm">Contact: info@rai-ranking.org</p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="hover:text-white/80 transition-colors">
                  Twitter/X
                </a>
                <a href="#" className="hover:text-white/80 transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-white/80 transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-white/60 text-center md:text-left">
              © 2025 RAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
