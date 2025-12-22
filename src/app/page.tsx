"use client";

import Link from "next/link";
import { useParticipateNavigation } from "@/hooks/useNavigation";

export default function LandingPage() {
  const { handleParticipateClick } = useParticipateNavigation();
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <main className="pt-16">
        <div className="relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-[#f0f4ff] to-white">
            {/* Gradient blobs */}
            <div className="absolute top-20 right-10 w-96 h-96 bg-[#0047AB]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#0099ED]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#000080]/5 rounded-full blur-3xl"></div>

            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(#0047AB 1px, transparent 1px), linear-gradient(90deg, #0047AB 1px, transparent 1px)",
                backgroundSize: "100px 100px",
              }}
            ></div>

            {/* Decorative shapes */}
            <div className="absolute top-40 left-20 w-3 h-3 bg-[#0047AB]/30 rounded-full shadow-lg shadow-[#0047AB]/50"></div>
            <div className="absolute top-60 right-40 w-4 h-4 bg-[#0099ED]/30 rounded-full shadow-lg shadow-[#0099ED]/50"></div>
            <div className="absolute bottom-40 right-20 w-3 h-3 bg-[#0047AB]/30 rounded-full shadow-lg shadow-[#0047AB]/50"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#000080] mb-8 leading-tight">
                Setting the Global Standard for{" "}
                <span className="bg-gradient-to-r from-[#0047AB] to-[#0099ED] bg-clip-text text-transparent">
                  Responsible AI
                </span>{" "}
                in Academia.
              </h1>
              <p className="text-xl md:text-2xl text-[#000080]/70 mb-10 max-w-2xl leading-relaxed font-medium">
                &ldquo;An independent framework to assess, benchmark, and guide
                universities in the ethical implementation of artificial
                intelligence.&rdquo;
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/ranking"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white px-8 py-4 rounded-xl transition-all duration-300 font-semibold shadow-2xl shadow-[#0047AB]/30 hover:shadow-[#0047AB]/50 hover:-translate-y-1 transform"
                >
                  Explore the 2025 Ranking →
                </Link>
                <Link
                  href="#"
                  onClick={handleParticipateClick}
                  className="inline-flex items-center justify-center bg-white border-3 border-[#0047AB] text-[#0047AB] hover:bg-gradient-to-r hover:from-[#0047AB] hover:to-[#0099ED] hover:text-white px-8 py-4 rounded-xl transition-all duration-300 font-semibold cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transform"
                >
                  Participate
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <section
          id="about"
          className="py-28 bg-gradient-to-b from-white via-[#f0f4ff] to-white relative"
        >
          {/* Decorative Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-16 bg-gradient-to-b from-transparent via-[#0047AB]/50 to-transparent rounded-full shadow-lg shadow-[#0047AB]/30"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block px-4 py-1 bg-gradient-to-r from-[#0047AB]/10 to-[#0099ED]/10 rounded-full mb-4 border border-[#0047AB]/20">
                  <span className="text-sm font-bold text-[#0047AB]">
                    WHO WE ARE
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#000080] mb-6 leading-tight">
                  Our Mission
                </h2>
                <p className="text-lg text-[#000080]/80 mb-4 leading-relaxed font-medium">
                  RAI (Responsible AI Global University Ranking) provides an
                  authoritative, transparent, and rigorous assessment of how
                  universities develop and deploy AI benchmarks and actionable
                  insights.
                </p>
                <p className="text-lg text-[#000080]/80 leading-relaxed font-medium">
                  We empower institutions, students, researchers, and the public
                  with objective benchmarks and actionable insights.
                </p>
              </div>
              <div className="relative">
                {/* Card Shadow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0047AB]/10 to-[#0099ED]/10 rounded-2xl blur-xl translate-y-2"></div>

                <div className="relative bg-white border-2 border-[#0047AB]/20 rounded-2xl p-10 shadow-xl">
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#0047AB] rounded-full"></div>
                  <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-[#0099ED] rounded-full"></div>

                  <p className="text-xl font-semibold text-[#000080] mb-8 italic leading-relaxed">
                    "What gets measured, gets improved. RAI sets the standard
                    for ethics in academic AI."
                  </p>
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-4xl font-bold bg-gradient-to-br from-[#0047AB] to-[#0099ED] bg-clip-text text-transparent mb-1">
                        150+
                      </div>
                      <div className="text-sm text-[#000080]/60 font-medium">
                        Institutions
                      </div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold bg-gradient-to-br from-[#0047AB] to-[#0099ED] bg-clip-text text-transparent mb-1">
                        30
                      </div>
                      <div className="text-sm text-[#000080]/60 font-medium">
                        Countries
                      </div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold bg-gradient-to-br from-[#0047AB] to-[#0099ED] bg-clip-text text-transparent mb-1">
                        2025
                      </div>
                      <div className="text-sm text-[#000080]/60 font-medium">
                        Latest Edition
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="participate"
          className="py-28 bg-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #0047AB 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            ></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1 bg-gradient-to-r from-[#0047AB]/10 to-[#0099ED]/10 rounded-full mb-4 border border-[#0047AB]/20">
                <span className="text-sm font-bold text-[#0047AB]">
                  GETTING STARTED
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#000080] mb-4">
                How It Works
              </h2>
              <p className="text-lg text-[#000080]/70 max-w-2xl mx-auto font-medium">
                Join leading universities in establishing responsible AI
                practices
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Lines */}
              <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#0047AB]/20 via-[#0047AB] to-[#0047AB]/20"></div>
              {/* Step 1 */}
              <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#0047AB]/30 hover:shadow-xl transition-all group">
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#0047AB] rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                  1
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#0047AB]/10 to-[#0099ED]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-[#0047AB]"
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
                <h3 className="text-2xl font-bold text-[#000080] mb-4">
                  Submit Data
                </h3>
                <p className="text-[#000080]/70 leading-relaxed font-medium">
                  Universities provide standardized information and evidence
                  across key domains.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#0047AB]/30 hover:shadow-xl transition-all group">
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#0047AB] rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                  2
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#0047AB]/10 to-[#0099ED]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-[#0047AB]"
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
                <h3 className="text-2xl font-bold text-[#000080] mb-4">
                  Independent Assessment
                </h3>
                <p className="text-[#000080]/70 leading-relaxed font-medium">
                  Our methodology evaluates governance, infrastructure,
                  curriculum, research, and impact.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#0047AB]/30 hover:shadow-xl transition-all group">
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#0047AB] rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                  3
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#0047AB]/10 to-[#0099ED]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-[#0047AB]"
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
                <h3 className="text-2xl font-bold text-[#000080] mb-4">
                  Receive Score & Insights
                </h3>
                <p className="text-[#000080]/70 leading-relaxed font-medium">
                  Access detailed feedback, benchmarking, and guidance to
                  improve responsible AI practice.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
