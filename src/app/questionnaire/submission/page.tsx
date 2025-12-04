"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/layout/Header";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

interface RankingInfo {
  rank: number | null;
  score: number | null;
  universityName: string | null;
  isCalculating: boolean;
}

export default function SubmissionPage() {
  const [rankingInfo, setRankingInfo] = useState<RankingInfo>({
    rank: null,
    score: null,
    universityName: null,
    isCalculating: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchRanking() {
      try {
        const supabase = getSupabaseBrowserClient();

        // Get current user's university
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Get university from general-info
        const { data: universityData } = await supabase
          .from("Universities")
          .select("id, name")
          .eq("pic_email", user.email)
          .maybeSingle();

        if (cancelled || !universityData) return;

        // Get ranking info
        const { data: rankingData } = await supabase
          .from("UniversityRankings")
          .select("rank, final_total_score")
          .eq("university_id", universityData.id)
          .eq("period", "all-time")
          .maybeSingle();

        if (cancelled) return;

        setRankingInfo({
          rank: rankingData?.rank ?? null,
          score: rankingData?.final_total_score ?? null,
          universityName: universityData.name,
          isCalculating: !rankingData?.rank,
        });
      } catch (error) {
        console.error("Failed to fetch ranking:", error);
        if (!cancelled) {
          setRankingInfo((prev) => ({ ...prev, isCalculating: false }));
        }
      }
    }

    // Initial fetch
    fetchRanking();

    // Poll for ranking updates (in case calculation is delayed)
    const interval = setInterval(fetchRanking, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#5C2E2E] mb-6">
              Submission Successful!
            </h1>

            {/* Message */}
            <p className="text-gray-700 mb-6 max-w-xl mx-auto leading-relaxed">
              Thank you
              {rankingInfo.universityName && `, ${rankingInfo.universityName}`}!
              Your questionnaire has been successfully submitted and scored.
            </p>

            {/* Ranking Display */}
            {rankingInfo.isCalculating ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-sm text-blue-700 font-medium">
                    Calculating your global ranking...
                  </p>
                </div>
              </div>
            ) : rankingInfo.rank ? (
              <div className="bg-gradient-to-br from-[#511715] to-[#8B3528] text-white rounded-lg p-6 mb-8">
                <p className="text-sm uppercase tracking-wide opacity-90 mb-2">
                  Your Global Rank
                </p>
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span className="text-5xl font-bold">
                    #{rankingInfo.rank}
                  </span>
                  {rankingInfo.score && (
                    <div className="text-left">
                      <p className="text-sm opacity-75">Total Score</p>
                      <p className="text-2xl font-bold">
                        {rankingInfo.score.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-sm opacity-90">
                  🎉 Congratulations on completing the RAI assessment!
                </p>
              </div>
            ) : null}

            <p className="text-gray-600 text-sm mb-8">
              View the complete rankings and detailed breakdown at the{" "}
              <Link
                href="/ranking"
                className="text-[#A84032] hover:underline font-medium"
              >
                ranking page
              </Link>
              .
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ranking"
                className="inline-flex items-center justify-center bg-[#A84032] hover:bg-[#8B3528] text-white font-medium px-8 py-3 rounded-md transition-colors"
              >
                View Full Rankings
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8 py-3 rounded-md transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{" "}
              <a
                href="mailto:info@rai-ranking.org"
                className="text-[#A84032] hover:underline"
              >
                info@rai-ranking.org
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#5C2E2E] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded"></div>
                <span className="text-xl font-bold">RAI</span>
              </div>
              <p className="text-sm text-white/80">
                Responsible AI Global University Ranking
              </p>
            </div>
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
