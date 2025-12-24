"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";
import type { SubmissionStatus } from "@/lib/types";

interface RankingInfo {
  rank: number | null;
  score: number | null;
  universityName: string | null;
}

const REVIEW_STATUSES = new Set<SubmissionStatus>([
  "on_review",
  "submitted",
  "pending",
]);

const APPROVED_STATUSES = new Set<SubmissionStatus>(["completed", "approved"]);

export default function SubmissionPage() {
  const [rankingInfo, setRankingInfo] = useState<RankingInfo>({
    rank: null,
    score: null,
    universityName: null,
  });
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabaseBrowserClient();

    const fetchStatus = async () => {
      if (cancelled) {
        return;
      }

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) {
          throw authError;
        }
        if (!user) {
          throw new Error("You must be signed in to view this page.");
        }

        const { data: universityData, error: universityError } = await supabase
          .from("Universities")
          .select("id, name")
          .eq("pic_email", user.email)
          .maybeSingle();

        if (universityError) {
          throw universityError;
        }
        if (!universityData) {
          throw new Error(
            "We couldn't find a university record linked to this account."
          );
        }

        const { data: submissionData, error: submissionError } = await supabase
          .from("Submissions")
          .select("status")
          .eq("university_id", universityData.id)
          .order("submitted_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (submissionError && submissionError.code !== "PGRST116") {
          throw submissionError;
        }

        if (cancelled) {
          return;
        }

        const latestStatus =
          (submissionData?.status as SubmissionStatus | null) ?? null;

        setSubmissionStatus(latestStatus);
        setRankingInfo({
          rank: null,
          score: null,
          universityName: universityData.name,
        });

        if (latestStatus && APPROVED_STATUSES.has(latestStatus)) {
          const { data: rankingData, error: rankingError } = await supabase
            .from("UniversityRankings")
            .select("rank, final_total_score")
            .eq("university_id", universityData.id)
            .eq("period", "all-time")
            .maybeSingle();

          if (rankingError) {
            throw rankingError;
          }

          if (cancelled) {
            return;
          }

          setRankingInfo({
            rank: rankingData?.rank ?? null,
            score: rankingData?.final_total_score ?? null,
            universityName: universityData.name,
          });
        }

        setErrorMessage(null);
      } catch (error) {
        console.error("Failed to fetch submission status:", error);
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load submission status."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingStatus(false);
        }
      }
    };

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  const isUnderReview =
    submissionStatus !== null && REVIEW_STATUSES.has(submissionStatus);
  const isApproved =
    submissionStatus !== null && APPROVED_STATUSES.has(submissionStatus);
  const needsSubmission =
    submissionStatus === null ||
    submissionStatus === "draft" ||
    submissionStatus === "rejected";

  const primaryHeading = isApproved
    ? "Submission Approved!"
    : isUnderReview
    ? "Submission Received"
    : needsSubmission
    ? "Submission Not Found"
    : "Submission Status";

  const statusDescription = (() => {
    if (isUnderReview) {
      return "Your questionnaire has been received and is currently under review by the RAI team.";
    }
    if (isApproved) {
      return "Your questionnaire has been approved and scored. You can now explore the live rankings.";
    }
    if (needsSubmission) {
      return "We couldn't find a submitted questionnaire for this account. Please resume your submission to continue.";
    }
    return "We are preparing your submission details.";
  })();

  const paragraphText = errorMessage ?? statusDescription;

  const renderStatusCard = () => {
    if (isLoadingStatus) {
      return (
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
              Checking your submission status...
            </p>
          </div>
        </div>
      );
    }

    if (isUnderReview) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex flex-col items-center text-yellow-900">
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c1.38 0 2.5-1.12 2.5-2.5S13.38 3 12 3s-2.5 1.12-2.5 2.5S10.62 8 12 8zm0 0v8m0 4h.01"
              />
            </svg>
            <p className="mt-3 text-sm font-medium text-center max-w-md">
              Your submission is under review. This page will refresh
              automatically once the status changes to completed.
            </p>
          </div>
        </div>
      );
    }

    if (isApproved) {
      if (rankingInfo.rank !== null) {
        return (
          <div className="bg-gradient-to-br from-[#0047AB] to-[#0099ED] text-white rounded-lg p-6 mb-8">
            <p className="text-sm uppercase tracking-wide opacity-90 mb-2">
              Your Global Rank
            </p>
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="text-5xl font-bold">#{rankingInfo.rank}</span>
              {rankingInfo.score !== null && (
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
        );
      }

      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-blue-800 text-center">
            We are preparing your ranking details. Please check back shortly.
          </p>
        </div>
      );
    }

    if (needsSubmission) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-red-800 text-center">
            Start or resume your questionnaire to submit it for review.
          </p>
        </div>
      );
    }

    return null;
  };

  const primaryAction = isApproved
    ? { href: "/ranking", label: "View Full Rankings" }
    : needsSubmission
    ? { href: "/questionnaire/criteria", label: "Resume Questionnaire" }
    : { href: "/questionnaire/review", label: "View Submission Details" };

  return (
    <div className="min-h-screen bg-[#f0f4ff]">
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-center mb-8">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isApproved
                  ? "bg-green-100 text-green-700"
                  : isUnderReview
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {isUnderReview ? (
                <svg
                  className="h-10 w-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l2 2m6-2a8 8 0 11-16 0 8 8 0 0116 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-10 w-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#000080] mb-6">
            {primaryHeading}
          </h1>

          <p className="text-gray-700 mb-6 max-w-xl mx-auto leading-relaxed">
            Thank you
            {rankingInfo.universityName &&
              `, ${rankingInfo.universityName}`}! {paragraphText}
          </p>

          {renderStatusCard()}

          {isApproved && (
            <p className="text-gray-600 text-sm mb-8">
              View the complete rankings and detailed breakdown at the{" "}
              <Link
                href="/ranking"
                className="text-[#0047AB] hover:underline font-medium"
              >
                ranking page
              </Link>
              .
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryAction && (
              <Link
                href={primaryAction.href}
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white font-medium px-8 py-3 rounded-md transition-all duration-200"
              >
                {primaryAction.label}
              </Link>
            )}
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8 py-3 rounded-md transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact us at{" "}
            <a
              href="mailto:info@rai-ranking.org"
              className="text-[#0047AB] hover:underline"
            >
              info@rai-ranking.org
            </a>
          </p>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#000080] text-white py-12">
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
