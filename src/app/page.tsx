"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#5C2E2E] mb-6 leading-tight">
              Setting the Global Standard for Responsible AI in Academia.
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
              An independent framework to assess, benchmark, and guide
              universities in the ethical implementation of artificial
              intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-[#A84032] hover:bg-[#8B3528] text-white px-8 py-3 rounded-md transition-colors font-medium"
              >
                Explore the 2025 Ranking →
              </Link>
              <a
                href="#participate"
                className="inline-flex items-center justify-center bg-white border border-[#A84032] text-[#A84032] hover:bg-[#A84032]/5 px-8 py-3 rounded-md transition-colors font-medium"
              >
                Participate
              </a>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <section id="about" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#5C2E2E] mb-6">
                  Our Mission
                </h2>
                <p className="text-gray-700 mb-4">
                  RAI (Responsible AI Global University Ranking) provides an
                  authoritative, transparent, and rigorous assessment of how
                  universities develop and deploy AI benchmarks and actionable
                  insights.
                </p>
                <p className="text-gray-700">
                  We empower institutions, students, researchers, and the public
                  with objective benchmarks and actionable insights.
                </p>
              </div>
              <div className="bg-[#FFF5F5] border border-[#FFE5E5] rounded-lg p-8">
                <p className="text-lg font-semibold text-[#5C2E2E] mb-6">
                  "What gets measured, gets improved. RAI sets the standard for
                  ethics in academic AI."
                </p>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-[#A84032]">
                      150+
                    </div>
                    <div className="text-sm text-gray-600">Institutions</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#A84032]">30</div>
                    <div className="text-sm text-gray-600">Countries</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#A84032]">
                      2025
                    </div>
                    <div className="text-sm text-gray-600">Latest Edition</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="participate" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#5C2E2E] mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FFF5F5] rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#A84032]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#5C2E2E] mb-3">
                  1. Submit Data
                </h3>
                <p className="text-gray-700">
                  Universities provide standardized information and evidence
                  across key domains.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FFF5F5] rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#A84032]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#5C2E2E] mb-3">
                  2. Independent Assessment
                </h3>
                <p className="text-gray-700">
                  Our methodology evaluates governance, infrastructure,
                  curriculum, research, and impact.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FFF5F5] rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-[#A84032]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#5C2E2E] mb-3">
                  3. Receive Your Score & Insights
                </h3>
                <p className="text-gray-700">
                  Access detailed feedback, benchmarking, and guidance to
                  improve responsible AI practice.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#5C2E2E] text-white py-12">
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