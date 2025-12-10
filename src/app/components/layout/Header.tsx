"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";
import { useParticipateNavigation } from "@/hooks/useNavigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const { handleParticipateClick } = useParticipateNavigation();

  useEffect(() => {
    const update = () =>
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");

    update();

    window.addEventListener("storage", update);
    window.addEventListener("auth-change", update);

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          localStorage.setItem("isLoggedIn", "true");
        } else {
          localStorage.removeItem("isLoggedIn");
        }
        update();
      }
    );

    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("auth-change", update);
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

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
    setIsLoggedIn(false);

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

            {/* Desktop Login/Logout Button */}
            {!isLoggedIn ? (
              <Link
                href="/authentication/login"
                className="bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm"
              >
                Logout
              </button>
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

            {/* Mobile Login/Logout Button */}
            <div className="px-4 pt-2">
              {!isLoggedIn ? (
                <Link
                  href="/authentication/login"
                  className="block w-full bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white text-center px-6 py-2 rounded-lg transition-all duration-300 shadow-lg font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg font-semibold"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
