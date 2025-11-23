"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import { useAuth } from "@/hooks/useAuth";

export default function NavBar() {
  const auth = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#5C2E2E] rounded"></div>
            <span className="text-xl font-bold text-[#5C2E2E]">RAI</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/about"
              className="text-gray-700 hover:text-[#5C2E2E] transition-colors"
            >
              About
            </Link>
            <Link
              href="/methodology"
              className="text-gray-700 hover:text-[#5C2E2E] transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-[#5C2E2E] transition-colors"
            >
              The Ranking
            </Link>
            
            {auth.user && auth.user.role === 'admin' && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-[#5C2E2E] transition-colors font-semibold"
              >
                Admin Dashboard
              </Link>
            )}

            {/* Desktop Login/Logout Button */}
            {auth.isLoading ? null : auth.user ? (
              <>
                <span className="text-sm text-gray-600">Welcome, {auth.user.name}</span>
                <button
                  onClick={auth.logout}
                  className="bg-[#A84032] hover:bg-[#8B3528] text-white px-6 py-2 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-[#A84032] hover:bg-[#8B3528] text-white px-6 py-2 rounded transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#5C2E2E] hover:bg-gray-100 transition-colors"
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
          <div className="md:hidden py-4 space-y-3 border-t border-gray-200">
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:text-[#5C2E2E] hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/methodology"
              className="block px-4 py-2 text-gray-700 hover:text-[#5C2E2E] hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Methodology
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:text-[#5C2E2E] hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              The Ranking
            </Link>

            {auth.user && auth.user.role === 'admin' && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-gray-700 hover:text-[#5C2E2E] hover:bg-gray-50 rounded-md transition-colors font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}

            {/* Mobile Login/Logout Button */}
            <div className="px-4 pt-2">
              {auth.isLoading ? null : auth.user ? (
                <>
                  <p className="text-sm text-gray-600 mb-2">Welcome, {auth.user.name}</p>
                  <button
                    onClick={() => {
                      auth.logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-[#A84032] hover:bg-[#8B3528] text-white px-6 py-2 rounded transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block w-full bg-[#A84032] hover:bg-[#8B3528] text-white text-center px-6 py-2 rounded transition-colors"
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