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
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (authError) throw authError;

      localStorage.setItem("userEmail", normalizedEmail);
      router.push("/questionnaire/general-info");
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
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* RAI Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-center text-[#5C2E2E] mb-12">
            RAI
          </h1>

          {/* Login Form Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#5C2E2E] mb-6">
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
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#A84032] hover:bg-[#8B3528] text-white font-medium py-3 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              {/* Links */}
              <div className="flex justify-between items-center pt-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#A84032] hover:text-[#8B3528] transition-colors"
                >
                  Forgot Password?
                </Link>
                <Link
                  href="/authentication/register"
                  className="text-sm text-[#A84032] hover:text-[#8B3528] transition-colors"
                >
                  Register your University
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#5C2E2E] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            {/* Logo and Description */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded"></div>
                <span className="text-xl font-bold">RAI</span>
              </div>
              <p className="text-sm text-white/80">
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
