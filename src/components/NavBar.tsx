"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import { useAuth } from "@/app/providers/AuthProvider"; // ✅ Fixed import

export default function NavBar() {
  const { user, profile, loading } = useAuth(); // ✅ Destructure profile & loading
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Add logout logic here if needed
    window.location.href = "/login";
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
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/about"
              className="text-white/90 hover:text-[#0099ED] transition-all duration-300 font-medium hover:scale-105 transform"
            >
              About
            </Link>
            <Link
              href="/methodology"
              className="text-white/90 hover:text-[#0099ED] transition-all duration-300 font-medium hover:scale-105 transform"
            >
              Methodology
            </Link>
            <Link
              href="/"
              className="text-white/90 hover:text-[#0099ED] transition-all duration-300 font-medium hover:scale-105 transform"
            >
              The Ranking
            </Link>

            {profile && profile.role === "admin" && (
              <Link
                href="/admin"
                className="text-white hover:text-[#0099ED] transition-all duration-300 font-semibold px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
              >
                Admin Dashboard
              </Link>
            )}

            {profile && profile.role === "reviewer" && (
              <Link
                href="/reviewer"
                className="text-white hover:text-[#0099ED] transition-all duration-300 font-semibold px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
              >
                Reviewer Dashboard
              </Link>
            )}

            {/* Desktop Login/Logout Button */}
            {loading ? null : user ? (
              <>
                <span className="text-sm text-white/80 font-medium">
                  Welcome, {profile?.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-white hover:text-[#0099ED] hover:bg-white/10 transition-all duration-300"
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
          <div className="md:hidden py-4 space-y-3 border-t border-[#0099ED]/30 bg-[#000080]/95 backdrop-blur-lg">
            <Link
              href="/about"
              className="block px-4 py-2 text-white hover:text-[#0099ED] hover:bg-white/10 rounded-md transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/methodology"
              className="block px-4 py-2 text-white hover:text-[#0099ED] hover:bg-white/10 rounded-md transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Methodology
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-white hover:text-[#0099ED] hover:bg-white/10 rounded-md transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              The Ranking
            </Link>

            {profile && profile.role === "admin" && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-white hover:text-[#0099ED] hover:bg-white/10 rounded-md transition-all duration-300 font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}

            {profile && profile.role === "reviewer" && (
              <Link
                href="/reviewer"
                className="block px-4 py-2 text-white hover:text-[#0099ED] hover:bg-white/10 rounded-md transition-all duration-300 font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reviewer Dashboard
              </Link>
            )}

            {/* Mobile Login/Logout Button */}
            <div className="px-4 pt-2">
              {loading ? null : user ? (
                <>
                  <div className="text-sm text-white/80 mb-2 font-medium">
                    Welcome, {profile?.name || user.email}
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
                  href="/login"
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
