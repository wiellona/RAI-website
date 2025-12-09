"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";
import { useParticipateNavigation } from "@/hooks/useNavigation";
import { useAuth } from "@/app/providers/AuthProvider"; // ✅ Ubah import ini

export default function Navbar() {
  const auth = useAuth(); // Sekarang menggunakan { user, profile, loading }
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const { handleParticipateClick } = useParticipateNavigation();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      localStorage.removeItem(`generalInfo_${userEmail}`);
      localStorage.removeItem(`questionnaireAnswers_${userEmail}`);
    }
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("universityName");

    window.dispatchEvent(new Event("auth-change"));

    window.location.href = "/";
  };

  return (
    <header className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#000080] border-b-2 border-[#0099ED] shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0047AB] to-[#0099ED] rounded-lg transform group-hover:scale-110 transition-transform duration-300 shadow-lg"></div>
            <span className="text-xl font-bold text-white group-hover:text-[#0099ED] transition-colors duration-300">
              RAI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/#about"
              className="text-white/90 hover:text-[#0099ED] transition-all duration-300 font-medium text-sm"
            >
              About
            </Link>
            <Link
              href="/ranking"
              className="text-white/90 hover:text-[#0099ED] transition-all duration-300 font-medium text-sm"
            >
              The Ranking
            </Link>
            <Link
              href="/ranking/automated"
              className="text-white/90 hover:text-[#0099ED] transition-all duration-300 font-medium text-sm"
            >
              Automated Ranking
            </Link>
            <Link
              href="/authentication/register"
              className="text-white/90 hover:text-[#0099ED] transition-all duration-300 font-medium text-sm"
            >
              Register
            </Link>

            <button
              type="button"
              onClick={handleParticipateClick}
              className="text-white/90 hover:text-[#0099ED] transition-all duration-300 font-medium cursor-pointer text-sm"
            >
              Participate
            </button>

            {/* Admin Dashboard Link */}
            {auth.profile && auth.profile.role === "admin" && (
              <Link
                href="/admin"
                className="text-white hover:text-[#0099ED] transition-all duration-300 font-semibold px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
              >
                Admin
              </Link>
            )}

            {/* Reviewer Dashboard Link */}
            {auth.profile && auth.profile.role === "reviewer" && (
              <Link
                href="/reviewer"
                className="text-white hover:text-[#0099ED] transition-all duration-300 font-semibold px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
              >
                Reviewer
              </Link>
            )}

            {/* Desktop Login/Logout Button */}
            {auth.loading ? null : auth.user ? (
              <>
                <span className="text-xs text-white/80 font-medium max-w-[120px] truncate">
                  Welcome, {auth.profile?.name || auth.user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/authentication/login"
                className="bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button (Burger Icon) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-white hover:text-[#0099ED] hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0099ED]"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-[#0099ED]/30 bg-[#000080]/95 backdrop-blur-lg">
            <Link
              href="/#about"
              className="block px-4 py-2.5 text-white hover:text-[#0099ED] hover:bg-white/10 rounded-md transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/ranking"
              className="block px-4 py-2.5 text-white hover:text-[#0099ED] hover:bg-white/10 rounded-md transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              The Ranking
            </Link>
            <Link
              href="/ranking/automated"
              className="block px-4 py-2.5 text-white hover:text-[#0099ED] hover:bg-white/10 rounded-md transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Automated Ranking
            </Link>
            <Link
              href="/authentication/register"
              className="block px-4 py-2.5 text-white hover:text-[#0099ED] hover:bg-white/10 rounded-md transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Register
            </Link>
            <button
              type="button"
              className="block w-full text-left px-4 py-2.5 text-white hover:text-[#0099ED] hover:bg-white/10 rounded-md transition-all duration-300 font-medium"
              onClick={() => {
                handleParticipateClick();
                setIsMobileMenuOpen(false);
              }}
            >
              Participate
            </button>

            {/* Mobile Admin Dashboard */}
            {auth.profile && auth.profile.role === "admin" && (
              <Link
                href="/admin"
                className="block px-4 py-2.5 text-white hover:text-[#0099ED] hover:bg-white/10 rounded-md transition-all duration-300 font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}

            {/* Mobile Reviewer Dashboard */}
            {auth.profile && auth.profile.role === "reviewer" && (
              <Link
                href="/reviewer"
                className="block px-4 py-2.5 text-white hover:text-[#0099ED] hover:bg-white/10 rounded-md transition-all duration-300 font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reviewer Dashboard
              </Link>
            )}

            {/* Mobile Login/Logout Button */}
            <div className="px-4 pt-2">
              {auth.loading ? null : auth.user ? (
                <>
                  <div className="text-sm text-white/80 mb-2 font-medium">
                    Welcome, {auth.profile?.name || auth.user.email}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/authentication/login"
                  className="block w-full bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white text-center px-6 py-2 rounded-lg transition-all duration-300 shadow-lg font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
